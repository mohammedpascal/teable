/* eslint-disable @typescript-eslint/no-explicit-any */
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { getPermissions, Role } from '@teable/core';
import { CollaboratorType } from '@teable/openapi';
import { ClsService } from 'nestjs-cls';
import { vi } from 'vitest';
import { mockDeep, mockReset } from 'vitest-mock-extended';
import { GlobalModule } from '../../global/global.module';
import { PrismaService } from '../../prisma';
import type { IClsStore } from '../../types/cls';
import { generateInvitationCode } from '../../utils/code-generate';
import { MailSenderService } from '../mail-sender/mail-sender.service';
import { InvitationModule } from './invitation.module';
import { InvitationService } from './invitation.service';

const mockInvitationId = 'invxxxxxxxxx';
const mockInvitationCode = generateInvitationCode(mockInvitationId);

describe('InvitationService', () => {
  const prismaService = mockDeep<PrismaService>();
  const mailSenderService = mockDeep<MailSenderService>();

  let invitationService: InvitationService;
  let clsService: ClsService<IClsStore>;

  const mockUser = { id: 'usr1', name: 'John', email: 'john@example.com' };
  const mockBase = { id: 'basexxxxxxxx', name: 'Test Base' };
  const mockInvitedUser = { id: 'usr2', name: 'Bob', email: 'bob@example.com' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [InvitationModule, GlobalModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaService)
      .overrideProvider(MailSenderService)
      .useValue(mailSenderService)
      .compile();

    clsService = module.get<ClsService<IClsStore>>(ClsService);
    invitationService = module.get<InvitationService>(InvitationService);

    prismaService.txClient.mockImplementation(() => {
      return prismaService;
    });

    prismaService.$tx.mockImplementation(async (fn, _options) => {
      return await fn(prismaService);
    });
  });

  afterEach(() => {
    mockReset(prismaService);
  });

  it('generateInvitation', async () => {
    await clsService.runWith(
      {
        user: mockUser,
        tx: {},
        permissions: getPermissions(Role.Creator),
      },
      async () => {
        await invitationService['generateInvitation']({
          resourceId: mockBase.id,
          resourceType: CollaboratorType.Base,
          role: Role.Creator,
          type: 'link',
        });
      }
    );

    expect(prismaService.invitation.create).toHaveBeenCalledWith({
      data: {
        id: expect.anything(),
        invitationCode: expect.anything(),
        baseId: mockBase.id,
        role: Role.Creator,
        type: 'link',
        expiredTime: null,
        createdBy: mockUser.id,
      },
    });
  });

  describe('emailInvitationByBase', () => {
    it('should throw error if base not found', async () => {
      prismaService.base.findFirst.mockResolvedValue(null);

      await expect(
        invitationService.emailInvitationByBase('base1', {
          emails: ['notfound@example.com'],
          role: Role.Creator,
        })
      ).rejects.toThrow('Base not found');
    });

    it('should send invitation email correctly', async () => {
      // mock data
      prismaService.base.findFirst.mockResolvedValue({ id: 'base1' } as any);
      prismaService.user.findMany.mockResolvedValue([mockInvitedUser as any]);
      vi.spyOn(invitationService as any, 'generateInvitation').mockResolvedValue({
        id: mockInvitationId,
        invitationCode: mockInvitationCode,
      } as any);

      const result = await clsService.runWith(
        {
          user: mockUser,
          tx: {},
          permissions: getPermissions(Role.Creator),
        },
        async () =>
          await invitationService.emailInvitationByBase('base1', {
            emails: [mockInvitedUser.email],
            role: Role.Creator,
          })
      );

      // Collaboration removed - no longer calling createBaseCollaborator
      expect(prismaService.invitationRecord.create).toHaveBeenCalledWith({
        data: {
          inviter: mockUser.id,
          accepter: mockInvitedUser.id,
          type: 'email',
          baseId: 'base1',
          invitationId: mockInvitationId,
        },
      });
      expect(mailSenderService.sendMail).toHaveBeenCalled();
      expect(result).toEqual({ [mockInvitedUser.email]: { invitationId: mockInvitationId } });
    });

    it('should rollback when tx fails', async () => {
      prismaService.base.findFirst.mockResolvedValue({ id: 'base1' } as any);
      prismaService.user.findMany.mockResolvedValue([mockInvitedUser as any]);
      prismaService.$tx.mockRejectedValue(new Error('tx error'));
      vi.spyOn(invitationService as any, 'checkBaseInvitation').mockResolvedValue(true);
      await clsService.runWith(
        {
          user: mockUser,
          tx: {},
          permissions: getPermissions(Role.Owner),
        },
        async () => {
          await expect(
            invitationService.emailInvitationByBase('base1', {
              emails: [mockInvitedUser.email],
              role: Role.Creator,
            })
          ).rejects.toThrow('tx error');
        }
      );
    });
  });

  describe('acceptInvitationLink', () => {
    const acceptInvitationLinkRo = {
      invitationCode: mockInvitationCode,
      invitationId: mockInvitationId,
    };

    it('should throw BadRequestException for invalid code', async () => {
      const errorAcceptInvitationLinkRo = {
        invitationCode: generateInvitationCode('xxxxx'),
        invitationId: mockInvitationId,
      };

      await clsService.runWith(
        {
          user: mockUser,
          tx: {},
          permissions: getPermissions(Role.Owner),
        },
        async () =>
          await expect(() =>
            invitationService.acceptInvitationLink(errorAcceptInvitationLinkRo)
          ).rejects.toThrow(BadRequestException)
      );
    });
    it('should throw NotFoundException for not found link invitation', async () => {
      prismaService.invitation.findFirst.mockResolvedValue(null);

      await clsService.runWith(
        {
          user: mockUser,
          tx: {},
          permissions: getPermissions(Role.Owner),
        },
        async () =>
          await expect(() =>
            invitationService.acceptInvitationLink(acceptInvitationLinkRo)
          ).rejects.toThrow(NotFoundException)
      );
    });
    it('should throw ForbiddenException for expired link', async () => {
      prismaService.invitation.findFirst.mockResolvedValue({
        id: mockInvitationId,
        invitationCode: mockInvitationCode,
        type: 'link',
        expiredTime: new Date('2022-01-01'),
        baseId: mockBase.id,
        createdTime: new Date('2022-01-02'),
        role: Role.Creator,
        createdBy: mockUser.id,
        lastModifiedBy: null,
        lastModifiedTime: null,
      });
      await clsService.runWith(
        {
          user: mockUser,
          tx: {},
          permissions: getPermissions(Role.Owner),
        },
        async () =>
          await expect(() =>
            invitationService.acceptInvitationLink(acceptInvitationLinkRo)
          ).rejects.toThrow(ForbiddenException)
      );
    });
    it('should return success for email', async () => {
      prismaService.invitation.findFirst.mockResolvedValue({
        id: mockInvitationId,
        invitationCode: mockInvitationCode,
        type: 'email',
        expiredTime: null,
        baseId: mockBase.id,
        createdTime: new Date(),
        role: Role.Creator,
        createdBy: mockUser.id,
        lastModifiedBy: null,
        lastModifiedTime: null,
      });
      await clsService.runWith(
        {
          user: mockUser,
          tx: {},
          permissions: getPermissions(Role.Creator),
        },
        async () => await invitationService.acceptInvitationLink(acceptInvitationLinkRo)
      );
    });
    it('exist collaborator - collaboration removed, always creates invitation record', async () => {
      prismaService.invitation.findFirst.mockResolvedValue({
        baseId: mockBase.id,
        type: 'link',
        expiredTime: null,
      } as any);
      prismaService.base.findUniqueOrThrow.mockResolvedValue(mockBase as any);
      const result = await clsService.runWith(
        {
          user: mockUser,
          tx: {},
          permissions: getPermissions(Role.Creator),
        },
        async () => await invitationService.acceptInvitationLink(acceptInvitationLinkRo)
      );
      expect(result.baseId).toEqual(mockBase.id);
    });
    it('should create invitation record', async () => {
      const mockInvitation = {
        id: mockInvitationId,
        invitationCode: mockInvitationCode,
        type: 'link',
        expiredTime: null,
        baseId: mockBase.id,
        createdTime: new Date('2022-01-02'),
        role: Role.Creator,
        createdBy: 'createdBy',
        lastModifiedBy: null,
        lastModifiedTime: null,
      };
      prismaService.invitation.findFirst.mockResolvedValue(mockInvitation);
      prismaService.base.findUniqueOrThrow.mockResolvedValue(mockBase as any);

      const result = await clsService.runWith(
        {
          user: mockUser,
          tx: {},
          permissions: getPermissions(Role.Creator),
        },
        async () => await invitationService.acceptInvitationLink(acceptInvitationLinkRo)
      );

      expect(prismaService.invitationRecord.create).toHaveBeenCalledWith({
        data: {
          invitationId: mockInvitation.id,
          inviter: mockInvitation.createdBy,
          accepter: mockUser.id,
          type: mockInvitation.type,
          baseId: mockInvitation.baseId,
        },
      });
      // Collaboration removed - no longer creating collaborators
      expect(result.baseId).toEqual(mockInvitation.baseId);
    });
  });
});
