/* eslint-disable sonarjs/no-duplicate-string */
import { Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import type {
  IDbConnectionVo,
  IGetBaseAllVo,
  IGetBasePermissionVo,
  IGetBaseVo,
} from '@teable/openapi';
import { baseQuerySchemaRo, IBaseQuerySchemaRo } from '@teable/openapi';
import { ZodValidationPipe } from '../../zod.validation.pipe';
import { BaseQueryService } from './base-query/base-query.service';
import { BaseService } from './base.service';
import { DbConnectionService } from './db-connection.service';

@Controller('api/base/')
export class BaseController {
  constructor(
    private readonly baseService: BaseService,
    private readonly dbConnectionService: DbConnectionService,
    private readonly baseQueryService: BaseQueryService
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
}
