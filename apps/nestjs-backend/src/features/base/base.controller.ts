/* eslint-disable sonarjs/no-duplicate-string */
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import type { IBaseRole } from '@teable/core';
import type {
  CreateBaseInvitationLinkVo,
  EmailInvitationVo,
  IDbConnectionVo,
  IGetBaseAllVo,
  IGetBasePermissionVo,
  IGetBaseVo,
  ListBaseInvitationLinkVo,
  UpdateBaseInvitationLinkVo,
} from '@teable/openapi';
import {
  baseQuerySchemaRo,
  CollaboratorType,
  CreateBaseInvitationLinkRo,
  createBaseInvitationLinkRoSchema,
  EmailBaseInvitationRo,
  emailBaseInvitationRoSchema,
  IBaseQuerySchemaRo,
  UpdateBaseInvitationLinkRo,
  updateBaseInvitationLinkRoSchema,
} from '@teable/openapi';
import { ZodValidationPipe } from '../../zod.validation.pipe';
import { InvitationService } from '../invitation/invitation.service';
import { BaseQueryService } from './base-query/base-query.service';
import { BaseService } from './base.service';
import { DbConnectionService } from './db-connection.service';

@Controller('api/base/')
export class BaseController {
  constructor(
    private readonly baseService: BaseService,
    private readonly dbConnectionService: DbConnectionService,
    private readonly baseQueryService: BaseQueryService,
    private readonly invitationService: InvitationService
  ) {}

  @Get(':baseId')
  async getBaseById(@Param('baseId') baseId: string): Promise<IGetBaseVo> {
    return await this.baseService.getBaseById(baseId);
  }

  @Get('access/all')
  async getAllBase(): Promise<IGetBaseAllVo> {
    return this.baseService.getAllBaseList();
  }

  @Post(':baseId/connection')
  async createDbConnection(@Param('baseId') baseId: string): Promise<IDbConnectionVo | null> {
    return await this.dbConnectionService.create(baseId);
  }

  @Get(':baseId/connection')
  async getDBConnection(@Param('baseId') baseId: string): Promise<IDbConnectionVo | null> {
    return await this.dbConnectionService.retrieve(baseId);
  }

  @Delete(':baseId/connection')
  async deleteDbConnection(@Param('baseId') baseId: string) {
    await this.dbConnectionService.remove(baseId);
    return null;
  }

  @Get(':baseId/permission')
  async getPermission(): Promise<IGetBasePermissionVo> {
    return await this.baseService.getPermission();
  }

  @Get(':baseId/query')
  async sqlQuery(
    @Param('baseId') baseId: string,
    @Query(new ZodValidationPipe(baseQuerySchemaRo)) query: IBaseQuerySchemaRo
  ) {
    return this.baseQueryService.baseQuery(baseId, query.query, query.cellFormat);
  }

  @Post(':baseId/invitation/link')
  async createInvitationLink(
    @Param('baseId') baseId: string,
    @Body(new ZodValidationPipe(createBaseInvitationLinkRoSchema))
    baseInvitationLinkRo: CreateBaseInvitationLinkRo
  ): Promise<CreateBaseInvitationLinkVo> {
    const res = await this.invitationService.generateInvitationLink({
      resourceId: baseId,
      resourceType: CollaboratorType.Base,
      role: baseInvitationLinkRo.role,
    });
    return {
      ...res,
      role: res.role as IBaseRole,
    };
  }

  @Delete(':baseId/invitation/link/:invitationId')
  async deleteInvitationLink(
    @Param('baseId') baseId: string,
    @Param('invitationId') invitationId: string
  ): Promise<void> {
    return this.invitationService.deleteInvitationLink({
      invitationId,
      resourceId: baseId,
      resourceType: CollaboratorType.Base,
    });
  }

  @Patch(':baseId/invitation/link/:invitationId')
  async updateInvitationLink(
    @Param('baseId') baseId: string,
    @Param('invitationId') invitationId: string,
    @Body(new ZodValidationPipe(updateBaseInvitationLinkRoSchema))
    updateBaseInvitationLinkRo: UpdateBaseInvitationLinkRo
  ): Promise<UpdateBaseInvitationLinkVo> {
    const res = await this.invitationService.updateInvitationLink({
      invitationId,
      role: updateBaseInvitationLinkRo.role,
      resourceId: baseId,
      resourceType: CollaboratorType.Base,
    });

    return {
      ...res,
      role: res.role as IBaseRole,
    };
  }

  @Get(':baseId/invitation/link')
  async listInvitationLink(@Param('baseId') baseId: string): Promise<ListBaseInvitationLinkVo> {
    return this.invitationService.getInvitationLink(baseId);
  }

  @Post(':baseId/invitation/email')
  async emailInvitation(
    @Param('baseId') baseId: string,
    @Body(new ZodValidationPipe(emailBaseInvitationRoSchema))
    emailBaseInvitationRo: EmailBaseInvitationRo
  ): Promise<EmailInvitationVo> {
    return this.invitationService.emailInvitationByBase(baseId, emailBaseInvitationRo);
  }
}
