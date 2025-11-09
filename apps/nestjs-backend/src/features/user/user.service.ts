import https from 'https';
import { join } from 'path';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { generateAccountId, generateUserId, minidenticon } from '@teable/core';
import { UploadType } from '@teable/openapi';
import type { IUserInfoVo, IUserNotifyMeta } from '@teable/openapi';
import { ClsService } from 'nestjs-cls';
import * as bcrypt from 'bcrypt';
import sharp from 'sharp';
import { EventEmitterService } from '../../event-emitter/event-emitter.service';
import { Events } from '../../event-emitter/events';
import { UserSignUpEvent } from '../../event-emitter/events/user/user.event';
import { PrismaService } from '../../prisma';
import type { Prisma } from '../../prisma';
import type { IClsStore } from '../../types/cls';
import StorageAdapter from '../attachments/plugins/adapter';
import { InjectStorageAdapter } from '../attachments/plugins/storage';
import { getFullStorageUrl } from '../attachments/plugins/utils';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cls: ClsService<IClsStore>,
    private readonly eventEmitterService: EventEmitterService,
    @InjectStorageAdapter() readonly storageAdapter: StorageAdapter
  ) {}

  async getUserById(id: string) {
    const userRaw = await this.prismaService.txClient().user.findUnique({
      where: { id },
      include: { role: true },
    });

    return (
      userRaw && {
        ...userRaw,
        avatar:
          userRaw.avatar &&
          getFullStorageUrl(StorageAdapter.getBucket(UploadType.Avatar), userRaw.avatar),
        notifyMeta: userRaw.notifyMeta && JSON.parse(userRaw.notifyMeta),
      }
    );
  }

  async getUserByEmail(email: string) {
    return await this.prismaService.txClient().user.findUnique({
      where: { email: email.toLowerCase() },
      include: { accounts: true },
    });
  }

  async createUserWithSettingCheck(
    user: Omit<Prisma.UserCreateInput, 'name'> & { name?: string },
    account?: Omit<Prisma.AccountUncheckedCreateInput, 'userId'>
  ) {
    const setting = await this.prismaService.setting.findFirst({
      select: {
        disallowSignUp: true,
      },
    });

    if (setting?.disallowSignUp) {
      throw new BadRequestException('The current instance disallow sign up by the administrator');
    }

    return await this.createUser(user, account);
  }

  async createUser(
    user: Omit<Prisma.UserCreateInput, 'name'> & { name?: string },
    account?: Omit<Prisma.AccountUncheckedCreateInput, 'userId'>
  ) {
    // defaults
    const defaultNotifyMeta: IUserNotifyMeta = {
      email: true,
    };

    user = {
      ...user,
      id: user.id ?? generateUserId(),
      email: user.email.toLowerCase(),
      notifyMeta: JSON.stringify(defaultNotifyMeta),
    };

    const userTotalCount = await this.prismaService.txClient().user.count({
      where: { isSystem: null },
    });

    const isAdmin = userTotalCount === 0;

    if (!user?.avatar) {
      const avatar = await this.generateDefaultAvatar(user.id!);
      user = {
        ...user,
        avatar,
      };
    }
    // default space created
    const newUser = await this.prismaService.txClient().user.create({
      data: {
        ...user,
        name: user.name ?? user.email.split('@')[0],
        isAdmin: isAdmin ? true : null,
      },
    });
    const { id } = newUser;
    if (account) {
      await this.prismaService.txClient().account.create({
        data: { id: generateAccountId(), ...account, userId: id },
      });
    }
    await this.cls.runWith(this.cls.get(), async () => {
      this.cls.set('user.id', id);
    });
    return newUser;
  }

  async updateUserName(id: string, name: string) {
    const user: IUserInfoVo = await this.prismaService.txClient().user.update({
      data: {
        name,
      },
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
      },
    });
    this.eventEmitterService.emitAsync(Events.USER_RENAME, user);
  }

  async updateAvatar(id: string, avatarFile: { path: string; mimetype: string; size: number }) {
    const path = join(StorageAdapter.getDir(UploadType.Avatar), id);
    const bucket = StorageAdapter.getBucket(UploadType.Avatar);
    const { hash } = await this.storageAdapter.uploadFileWidthPath(bucket, path, avatarFile.path, {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'Content-Type': avatarFile.mimetype,
    });
    const { size, mimetype } = avatarFile;

    await this.mountAttachment(id, {
      hash,
      size,
      mimetype,
      token: id,
      path,
    });

    await this.prismaService.txClient().user.update({
      data: {
        avatar: path,
      },
      where: { id },
    });
  }

  private async mountAttachment(
    userId: string,
    input: Prisma.AttachmentsCreateInput | Prisma.AttachmentsUpdateInput
  ) {
    await this.prismaService.txClient().attachments.upsert({
      create: {
        ...input,
        createdBy: userId,
      } as Prisma.AttachmentsCreateInput,
      update: input as Prisma.AttachmentsUpdateInput,
      where: {
        token: userId,
      },
    });
  }

  async updateNotifyMeta(id: string, notifyMetaRo: IUserNotifyMeta) {
    await this.prismaService.txClient().user.update({
      data: {
        notifyMeta: JSON.stringify(notifyMetaRo),
      },
      where: { id },
    });
  }

  private async generateDefaultAvatar(id: string) {
    const path = join(StorageAdapter.getDir(UploadType.Avatar), id);
    const bucket = StorageAdapter.getBucket(UploadType.Avatar);

    const svgSize = [410, 410];
    const svgString = minidenticon(id);
    const svgObject = sharp(Buffer.from(svgString))
      .resize(svgSize[0], svgSize[1])
      .flatten({ background: '#f0f0f0' })
      .png({ quality: 90 });
    const mimetype = 'image/png';
    const { size } = await svgObject.metadata();
    const svgBuffer = await svgObject.toBuffer();

    const { hash } = await this.storageAdapter.uploadFile(bucket, path, svgBuffer, {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'Content-Type': mimetype,
    });

    await this.mountAttachment(id, {
      hash: hash,
      size: size,
      mimetype: mimetype,
      token: id,
      path: path,
      width: svgSize[0],
      height: svgSize[1],
    });

    return path;
  }

  private async uploadAvatarByUrl(userId: string, url: string) {
    return new Promise<string>((resolve, reject) => {
      https
        .get(url, async (stream) => {
          const contentType = stream?.headers?.['content-type']?.split(';')?.[0];
          const size = stream?.headers?.['content-length']?.split(';')?.[0];
          const path = join(StorageAdapter.getDir(UploadType.Avatar), userId);
          const bucket = StorageAdapter.getBucket(UploadType.Avatar);

          const { hash } = await this.storageAdapter.uploadFile(bucket, path, stream, {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'Content-Type': contentType,
          });

          await this.mountAttachment(userId, {
            hash: hash,
            size: size ? parseInt(size) : undefined,
            mimetype: contentType,
            token: userId,
            path: path,
          });
          resolve(path);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  async findOrCreateUser(user: {
    name: string;
    email: string;
    provider: string;
    providerId: string;
    type: string;
    avatarUrl?: string;
  }) {
    const res = await this.prismaService.$tx(async () => {
      const { email, name, provider, providerId, type, avatarUrl } = user;
      // account exist check
      const existAccount = await this.prismaService.txClient().account.findFirst({
        where: { provider, providerId },
      });
      if (existAccount) {
        return await this.getUserById(existAccount.userId);
      }

      // user exist check
      const existUser = await this.getUserByEmail(email);
      if (existUser && existUser.isSystem) {
        throw new UnauthorizedException('User is system user');
      }
      if (!existUser) {
        const userId = generateUserId();
        let avatar: string | undefined = undefined;
        if (avatarUrl) {
          avatar = await this.uploadAvatarByUrl(userId, avatarUrl);
        }
        return await this.createUserWithSettingCheck(
          { id: userId, email, name, avatar },
          { provider, providerId, type }
        );
      }

      await this.prismaService.txClient().account.create({
        data: { id: generateAccountId(), provider, providerId, type, userId: existUser.id },
      });
      return existUser;
    });
    if (res) {
      this.eventEmitterService.emitAsync(Events.USER_SIGNUP, new UserSignUpEvent(res.id));
    }
    return res;
  }

  async refreshLastSignTime(userId: string) {
    await this.prismaService.txClient().user.update({
      where: { id: userId },
      data: { lastSignTime: new Date().toISOString() },
    });
  }

  async getUserInfoList(userIds: string[]) {
    const userList = await this.prismaService.user.findMany({
      where: {
        id: { in: userIds },
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
      },
    });
    return userList.map((user) => {
      const { avatar } = user;
      return {
        ...user,
        avatar: avatar && getFullStorageUrl(StorageAdapter.getBucket(UploadType.Avatar), avatar),
      };
    });
  }

  async createSystemUser({
    id = generateUserId(),
    email,
    name,
    avatar,
  }: {
    id?: string;
    email: string;
    name: string;
    avatar?: string;
  }) {
    return this.prismaService.$tx(async () => {
      if (!avatar) {
        avatar = await this.generateDefaultAvatar(id);
      }
      return this.prismaService.txClient().user.create({
        data: {
          id,
          email,
          name,
          avatar,
          isSystem: true,
        },
      });
    });
  }

  async getUserList(skip = 0, take = 100) {
    const [users, total] = await Promise.all([
      this.prismaService.user.findMany({
        where: {
          isSystem: null,
        },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          isAdmin: true,
          createdTime: true,
          lastSignTime: true,
          deactivatedTime: true,
          roleId: true,
          role: {
            select: {
              id: true,
              name: true,
              description: true,
              permissions: true,
            },
          },
        },
        skip,
        take,
        orderBy: {
          createdTime: 'desc',
        },
      }),
      this.prismaService.user.count({
        where: {
          isSystem: null,
        },
      }),
    ]);

    return {
      users: users.map((user) => ({
        ...user,
        avatar:
          user.avatar &&
          getFullStorageUrl(StorageAdapter.getBucket(UploadType.Avatar), user.avatar),
      })),
      total,
    };
  }

  async updateUserAdmin(
    id: string,
    data: {
      name?: string;
      email?: string;
      isAdmin?: boolean;
      roleId?: string | null;
    }
  ) {
    const updateData: Prisma.UserUpdateInput = {};
    if (data.name !== undefined) {
      updateData.name = data.name;
    }
    if (data.email !== undefined) {
      updateData.email = data.email.toLowerCase();
    }
    if (data.isAdmin !== undefined) {
      updateData.isAdmin = data.isAdmin ? true : null;
    }
    if (data.roleId !== undefined) {
      if (data.roleId === null) {
        updateData.role = { disconnect: true };
      } else {
        updateData.role = { connect: { id: data.roleId } };
      }
    }

    const user = await this.prismaService.txClient().user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        isAdmin: true,
        createdTime: true,
        lastSignTime: true,
        deactivatedTime: true,
        roleId: true,
        role: {
          select: {
            id: true,
            name: true,
            description: true,
            permissions: true,
          },
        },
      },
    });

    return {
      ...user,
      avatar:
        user.avatar &&
        getFullStorageUrl(StorageAdapter.getBucket(UploadType.Avatar), user.avatar),
    };
  }

  async assignRoleToUser(userId: string, roleId: string) {
    // Verify role exists
    const role = await this.prismaService.txClient().role.findUnique({
      where: { id: roleId },
    });

    if (!role) {
      throw new BadRequestException(`Role with id "${roleId}" not found`);
    }

    return await this.prismaService.txClient().user.update({
      where: { id: userId },
      data: { roleId },
      include: { role: true },
    });
  }

  async removeRoleFromUser(userId: string) {
    return await this.prismaService.txClient().user.update({
      where: { id: userId },
      data: { roleId: null },
      include: { role: true },
    });
  }

  async deleteUser(id: string) {
    const currentUserId = this.cls.get('user.id');
    if (id === currentUserId) {
      throw new BadRequestException('Cannot delete your own account');
    }

    const user = await this.prismaService.txClient().user.findUnique({
      where: { id },
      select: { isSystem: true, isAdmin: true },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.isSystem) {
      throw new BadRequestException('Cannot delete system user');
    }

    await this.prismaService.txClient().user.delete({
      where: { id },
    });
  }

  async createUserAdmin(
    userData: {
      name: string;
      email: string;
      password?: string;
      isAdmin?: boolean;
    }
  ) {
    const defaultNotifyMeta: IUserNotifyMeta = {
      email: true,
    };

    let password: string | undefined;
    let salt: string | undefined;

    if (userData.password) {
      salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(userData.password, salt);
    }

    const userId = generateUserId();
    let avatar: string | undefined;
    if (!avatar) {
      avatar = await this.generateDefaultAvatar(userId);
    }

    const newUser = await this.prismaService.txClient().user.create({
      data: {
        id: userId,
        name: userData.name,
        email: userData.email.toLowerCase(),
        password,
        salt,
        avatar,
        isAdmin: userData.isAdmin ? true : null,
        notifyMeta: JSON.stringify(defaultNotifyMeta),
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        isAdmin: true,
        createdTime: true,
        lastSignTime: true,
        deactivatedTime: true,
      },
    });

    return {
      ...newUser,
      avatar:
        newUser.avatar &&
        getFullStorageUrl(StorageAdapter.getBucket(UploadType.Avatar), newUser.avatar),
    };
  }
}
