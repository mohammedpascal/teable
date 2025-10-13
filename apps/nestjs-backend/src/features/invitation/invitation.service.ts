/* eslint-disable sonarjs/no-duplicate-string */
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { IBaseRole } from '@teable/core';
import { generateInvitationId } from '@teable/core';
import { PrismaService } from '@teable/db-main-prisma';
import {
  CollaboratorType,
  PrincipalType,
  type AcceptInvitationLinkRo,
  type EmailInvitationVo,
  type EmailBaseInvitationRo,
  type ItemBaseInvitationLinkVo,
} from '@teable/openapi';
import dayjs from 'dayjs';
import { pick } from 'lodash';
import { ClsService } from 'nestjs-cls';
import type { IMailConfig } from '../../configs/mail.config';
import type { IClsStore } from '../../types/cls';
import { generateInvitationCode } from '../../utils/code-generate';
import { CollaboratorService } from '../collaborator/collaborator.service';
import { MailSenderService } from '../mail-sender/mail-sender.service';
import { UserService } from '../user/user.service';

@Injectable()
export class InvitationService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cls: ClsService<IClsStore>,
    private readonly configService: ConfigService,
    private readonly mailSenderService: MailSenderService,
    private readonly collaboratorService: CollaboratorService,
    private readonly userService: UserService
  ) {}

  private generateInviteUrl(invitationId: string, invitationCode: string) {
    const mailConfig = this.configService.get<IMailConfig>('mail');
    return `${mailConfig?.origin}/invite?invitationId=${invitationId}&invitationCode=${invitationCode}`;
  }

  private async createNotExistedUser(emails: string[]) {
    const users: { email: string; name: string; id: string }[] = [];
    for (const email of emails) {
      const user = await this.userService.createUser({ email });
      users.push(pick(user, 'id', 'name', 'email'));
    }
    return users;
  }

  private async checkBaseInvitation() {
    const user = this.cls.get('user');

    if (!user?.isAdmin) {
      const setting = await this.prismaService.setting.findFirst({
        select: {
          disallowSpaceInvitation: true,
        },
      });

      if (setting?.disallowSpaceInvitation) {
        throw new ForbiddenException(
          'The current instance disallow base invitation by the administrator'
        );
      }
    }
  }

  private async emailInvitation({
    emails,
    role,
    resourceId,
    resourceName,
    resourceType,
  }: {
    emails: string[];
    role: IBaseRole;
    resourceId: string;
    resourceName: string;
    resourceType: CollaboratorType;
  }) {
    const user = this.cls.get('user');
    const departmentIds = this.cls.get('organization.departments')?.map((d) => d.id);
    await this.collaboratorService.validateUserAddRole({
      departmentIds,
      userId: user.id,
      addRole: role,
      resourceId,
      resourceType,
    });
    const invitationEmails = emails.map((email) => email.toLowerCase());
    const sendUsers = await this.prismaService.user.findMany({
      select: { id: true, name: true, email: true },
      where: { email: { in: invitationEmails } },
    });

    const noExistEmails = invitationEmails.filter(
      (email) => !sendUsers.find((u) => u.email.toLowerCase() === email.toLowerCase())
    );

    return this.prismaService.$tx(async () => {
      // create user if not exist
      const newUsers = await this.createNotExistedUser(noExistEmails);
      sendUsers.push(...newUsers);

      const result: EmailInvitationVo = {};
      for (const sendUser of sendUsers) {
        // create collaborator link
        await this.collaboratorService.createBaseCollaborator({
          collaborators: [
            {
              principalId: sendUser.id,
              principalType: PrincipalType.User,
            },
          ],
          baseId: resourceId,
          role,
        });
        // generate invitation record
        const { id, invitationCode } = await this.generateInvitation({
          type: 'email',
          role,
          resourceId,
          resourceType,
        });

        // save invitation record for audit
        await this.prismaService.txClient().invitationRecord.create({
          data: {
            inviter: user.id,
            accepter: sendUser.id,
            type: 'email',
            baseId: resourceType === CollaboratorType.Base ? resourceId : null,
            invitationId: id,
          },
        });
        // get email info
        const inviteEmailOptions = this.mailSenderService.inviteEmailOptions({
          name: user.name,
          email: user.email,
          resourceName,
          resourceType,
          inviteUrl: this.generateInviteUrl(id, invitationCode),
        });
        this.mailSenderService.sendMail({
          to: sendUser.email,
          ...inviteEmailOptions,
        });
        result[sendUser.email] = { invitationId: id };
      }
      return result;
    });
  }

  async emailInvitationByBase(baseId: string, data: EmailBaseInvitationRo) {
    await this.checkBaseInvitation();

    const base = await this.prismaService.base.findFirst({
      select: { name: true },
      where: { id: baseId, deletedTime: null },
    });
    if (!base) {
      throw new BadRequestException('Base not found');
    }

    return this.emailInvitation({
      emails: data.emails,
      role: data.role,
      resourceId: baseId,
      resourceName: base.name,
      resourceType: CollaboratorType.Base,
    });
  }

  async generateInvitationLink({
    role,
    resourceId,
    resourceType,
  }: {
    role: IBaseRole;
    resourceId: string;
    resourceType: CollaboratorType;
  }): Promise<ItemBaseInvitationLinkVo> {
    const departmentIds = this.cls.get('organization.departments')?.map((d) => d.id);
    await this.collaboratorService.validateUserAddRole({
      departmentIds,
      userId: this.cls.get('user.id'),
      addRole: role,
      resourceId,
      resourceType,
    });
    const { id, createdBy, createdTime, invitationCode } = await this.generateInvitation({
      role,
      resourceId,
      resourceType,
      type: 'link',
    });
    return {
      id,
      role,
      createdBy,
      createdTime: createdTime.toISOString(),
      invitationCode,
      type: 'link',
      expiredTime: null,
    };
  }

  private async generateInvitation({
    type,
    role,
    resourceId,
    resourceType,
  }: {
    type: 'link' | 'email';
    role: IBaseRole;
    resourceId: string;
    resourceType: CollaboratorType;
  }) {
    const userId = this.cls.get('user.id');
    const invitationId = generateInvitationId();
    return this.prismaService.txClient().invitation.create({
      data: {
        id: invitationId,
        invitationCode: generateInvitationCode(invitationId),
        baseId: resourceType === CollaboratorType.Base ? resourceId : null,
        role,
        type,
        expiredTime:
          type === 'email' ? dayjs(new Date()).add(1, 'month').toDate().toISOString() : null,
        createdBy: userId,
      },
    });
  }

  async deleteInvitationLink({
    invitationId,
    resourceId,
  }: {
    invitationId: string;
    resourceId: string;
    resourceType: CollaboratorType;
  }) {
    await this.prismaService.invitation.update({
      where: {
        id: invitationId,
        type: 'link',
        baseId: resourceId,
      },
      data: { deletedTime: new Date().toISOString() },
    });
  }

  async updateInvitationLink({
    invitationId,
    role,
    resourceId,
    resourceType,
  }: {
    invitationId: string;
    role: IBaseRole;
    resourceId: string;
    resourceType: CollaboratorType;
  }) {
    const departmentIds = this.cls.get('organization.departments')?.map((d) => d.id);
    await this.collaboratorService.validateUserAddRole({
      departmentIds,
      userId: this.cls.get('user.id'),
      addRole: role,
      resourceId,
      resourceType,
    });
    const { id } = await this.prismaService.invitation.update({
      where: {
        id: invitationId,
        type: 'link',
        baseId: resourceId,
      },
      data: {
        role,
      },
    });
    return {
      invitationId: id,
      role,
    };
  }

  async getInvitationLink(resourceId: string) {
    const data = await this.prismaService.invitation.findMany({
      select: { id: true, role: true, createdBy: true, createdTime: true, invitationCode: true },
      where: {
        baseId: resourceId,
        type: 'link',
        deletedTime: null,
      },
    });
    return data.map(({ id, role, createdBy, createdTime, invitationCode }) => ({
      type: 'link',
      id,
      role: role as IBaseRole,
      createdBy,
      createdTime: createdTime.toISOString(),
      invitationCode,
      expiredTime: null,
    }));
  }

  async acceptInvitationLink(acceptInvitationLinkRo: AcceptInvitationLinkRo) {
    const currentUserId = this.cls.get('user.id');
    const { invitationCode, invitationId } = acceptInvitationLinkRo;
    if (generateInvitationCode(invitationId) !== invitationCode) {
      throw new BadRequestException('invalid code');
    }
    const linkInvitation = await this.prismaService.invitation.findFirst({
      where: {
        id: invitationId,
        deletedTime: null,
      },
    });
    if (!linkInvitation) {
      throw new NotFoundException(`link ${invitationId} not found`);
    }

    const { expiredTime, baseId, role, createdBy, type } = linkInvitation;

    if (expiredTime && expiredTime < new Date()) {
      throw new ForbiddenException('link has expired');
    }

    if (type === 'email') {
      return { baseId, spaceId: null };
    }

    if (!baseId) {
      throw new BadRequestException('Invalid link: baseId not found');
    }

    await this.prismaService
      .txClient()
      .base.findUniqueOrThrow({
        where: { id: baseId, deletedTime: null },
      })
      .catch(() => {
        throw new NotFoundException(`base ${baseId} not found`);
      });

    const exist = await this.prismaService.txClient().collaborator.count({
      where: {
        principalId: currentUserId,
        principalType: PrincipalType.User,
        resourceId: baseId,
      },
    });
    if (!exist) {
      await this.prismaService.$tx(async () => {
        await this.collaboratorService.createBaseCollaborator({
          collaborators: [
            {
              principalId: currentUserId,
              principalType: PrincipalType.User,
            },
          ],
          baseId,
          role: role as IBaseRole,
          createdBy,
        });
        // save invitation record for audit
        await this.prismaService.txClient().invitationRecord.create({
          data: {
            invitationId: linkInvitation.id,
            inviter: createdBy,
            accepter: currentUserId,
            type: 'link',
            baseId,
          },
        });
      });
    }
    return { baseId, spaceId: null };
  }
}
