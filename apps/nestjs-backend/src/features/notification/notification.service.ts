import { Injectable, Logger } from '@nestjs/common';
import type { ISendMailOptions } from '@nestjs-modules/mailer';
import type { INotificationBuffer, INotificationUrl } from '@teable/core';
import {
  assertNever,
  generateNotificationId,
  getUserNotificationChannel,
  NotificationStatesEnum,
  NotificationTypeEnum,
  notificationUrlSchema,
  SYSTEM_USER_ID,
} from '@teable/core';
import {
  UploadType,
  type IGetNotifyListQuery,
  type INotificationUnreadCountVo,
  type INotificationVo,
  type IUpdateNotifyStatusRo,
} from '@teable/openapi';
import keyBy from 'lodash/keyBy';
import { IMailConfig, MailConfig } from '../../configs/mail.config';
import type { Prisma } from '../../prisma';
import { PrismaService } from '../../prisma';
import { ShareDbService } from '../../share-db/share-db.service';
import StorageAdapter from '../attachments/plugins/adapter';
import { getFullStorageUrl } from '../attachments/plugins/utils';
import { MailSenderService } from '../mail-sender/mail-sender.service';
import { UserService } from '../user/user.service';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly shareDbService: ShareDbService,
    private readonly mailSenderService: MailSenderService,
    private readonly userService: UserService,
    @MailConfig() private readonly mailConfig: IMailConfig
  ) {}

  async sendCommonNotify(
    params: {
      path: string;
      fromUserId?: string;
      toUserId: string;
      message: string;
      emailConfig?: {
        title: string;
        message: string;
        buttonUrl?: string; // use path as default
        buttonText?: string; // use 'View' as default
      };
    },
    type = NotificationTypeEnum.System
  ) {
    const { toUserId, emailConfig, message, path, fromUserId = SYSTEM_USER_ID } = params;
    const notifyId = generateNotificationId();
    const toUser = await this.userService.getUserById(toUserId);
    if (!toUser) {
      return;
    }

    const data: Prisma.NotificationCreateInput = {
      id: notifyId,
      fromUserId: fromUserId,
      toUserId,
      type,
      urlPath: path,
      createdBy: fromUserId,
      message,
    };
    const notifyData = await this.createNotify(data);

    const unreadCount = (await this.unreadCount(toUser.id)).unreadCount;

    const rawUsers = await this.prismaService.user.findMany({
      select: { id: true, name: true, avatar: true },
      where: { id: fromUserId },
    });
    const fromUserSets = keyBy(rawUsers, 'id');

    const systemNotifyIcon = this.generateNotifyIcon(
      notifyData.type as NotificationTypeEnum,
      fromUserId,
      fromUserSets
    );

    const socketNotification = {
      notification: {
        id: notifyData.id,
        message: notifyData.message,
        notifyType: type,
        url: this.mailConfig.origin + path,
        notifyIcon: systemNotifyIcon,
        isRead: false,
        createdTime: notifyData.createdTime.toISOString(),
      },
      unreadCount: unreadCount,
    };

    this.sendNotifyBySocket(toUser.id, socketNotification);

    if (emailConfig && toUser.notifyMeta && toUser.notifyMeta.email) {
      const emailOptions = this.mailSenderService.commonEmailOptions({
        ...emailConfig,
        to: toUserId,
        buttonUrl: emailConfig.buttonUrl || this.mailConfig.origin + path,
        buttonText: emailConfig.buttonText || 'View',
      });
      this.sendNotifyByMail(toUser.email, emailOptions);
    }
  }

  async sendImportResultNotify(params: { tableId: string; toUserId: string; message: string }) {
    const { toUserId, tableId, message } = params;
    const toUser = await this.userService.getUserById(toUserId);
    if (!toUser) {
      return;
    }
    const type = NotificationTypeEnum.System;
    const urlMeta = notificationUrlSchema.parse({
      tableId: tableId,
    });
    const notifyPath = this.generateNotifyPath(type, urlMeta);

    this.sendCommonNotify({
      path: notifyPath,
      toUserId,
      message,
      emailConfig: {
        title: 'Import result notification',
        message: message,
      },
    });
  }

  async getNotifyList(userId: string, query: IGetNotifyListQuery): Promise<INotificationVo> {
    const { notifyStates, cursor } = query;
    const limit = 10;

    const data = await this.prismaService.notification.findMany({
      where: {
        toUserId: userId,
        isRead: notifyStates === NotificationStatesEnum.Read,
      },
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: {
        createdTime: 'desc',
      },
    });

    // Doesn't seem like a good way
    const fromUserIds = data.map((v) => v.fromUserId);
    const rawUsers = await this.prismaService.user.findMany({
      select: { id: true, name: true, avatar: true },
      where: { id: { in: fromUserIds } },
    });
    const fromUserSets = keyBy(rawUsers, 'id');

    const notifications = data.map((v) => {
      const notifyIcon = this.generateNotifyIcon(
        v.type as NotificationTypeEnum,
        v.fromUserId,
        fromUserSets
      );
      return {
        id: v.id,
        notifyIcon: notifyIcon,
        notifyType: v.type as NotificationTypeEnum,
        url: this.mailConfig.origin + v.urlPath,
        message: v.message,
        isRead: v.isRead,
        createdTime: v.createdTime.toISOString(),
      };
    });

    let nextCursor: typeof cursor | undefined = undefined;
    if (notifications.length > limit) {
      const nextItem = notifications.pop();
      nextCursor = nextItem!.id;
    }
    return {
      notifications,
      nextCursor,
    };
  }

  private generateNotifyIcon(
    notifyType: NotificationTypeEnum,
    fromUserId: string,
    fromUserSets: Record<string, { id: string; name: string; avatar: string | null }>
  ) {
    const origin = this.mailConfig.origin;

    switch (notifyType) {
      case NotificationTypeEnum.System:
        return { iconUrl: `${origin}/images/favicon/favicon.svg` };
      case NotificationTypeEnum.CollaboratorCellTag:
      case NotificationTypeEnum.CollaboratorMultiRowTag: {
        const { id, name, avatar } = fromUserSets[fromUserId];

        return {
          userId: id,
          userName: name,
          userAvatarUrl:
            avatar && getFullStorageUrl(StorageAdapter.getBucket(UploadType.Avatar), avatar),
        };
      }
      default:
        throw assertNever(notifyType);
    }
  }

  private generateNotifyPath(notifyType: NotificationTypeEnum, urlMeta: INotificationUrl) {
    switch (notifyType) {
      case NotificationTypeEnum.System: {
        const { tableId } = urlMeta || {};
        return `/table/${tableId}`;
      }
      case NotificationTypeEnum.CollaboratorCellTag:
      case NotificationTypeEnum.CollaboratorMultiRowTag: {
        const { tableId, recordId } = urlMeta || {};

        return `/table/${tableId}${recordId ? `?recordId=${recordId}` : ''}`;
      }
      default:
        throw assertNever(notifyType);
    }
  }

  async unreadCount(userId: string): Promise<INotificationUnreadCountVo> {
    const unreadCount = await this.prismaService.notification.count({
      where: {
        toUserId: userId,
        isRead: false,
      },
    });
    return { unreadCount };
  }

  async updateNotifyStatus(
    userId: string,
    notificationId: string,
    updateNotifyStatusRo: IUpdateNotifyStatusRo
  ): Promise<void> {
    const { isRead } = updateNotifyStatusRo;

    await this.prismaService.notification.updateMany({
      where: {
        id: notificationId,
        toUserId: userId,
      },
      data: {
        isRead: isRead,
      },
    });
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.prismaService.notification.updateMany({
      where: {
        toUserId: userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });
  }

  private async createNotify(data: Prisma.NotificationCreateInput) {
    return this.prismaService.notification.create({ data });
  }

  private async sendNotifyBySocket(toUserId: string, data: INotificationBuffer) {
    const channel = getUserNotificationChannel(toUserId);

    const presence = this.shareDbService.connect().getPresence(channel);
    const localPresence = presence.create(data.notification.id);

    return new Promise((resolve) => {
      localPresence.submit(data, (error) => {
        error && this.logger.error(error);
        resolve(data);
      });
    });
  }

  private async sendNotifyByMail(to: string, emailOptions: ISendMailOptions) {
    await this.mailSenderService.sendMail({
      to,
      ...emailOptions,
    });
  }
}
