/* eslint-disable sonarjs/no-duplicate-string */
import { Controller, Get, Param, Query } from '@nestjs/common';
import type { IGetBaseAllVo, IGetBasePermissionVo, IGetBaseVo } from '@teable/openapi';
import { baseQuerySchemaRo, IBaseQuerySchemaRo } from '@teable/openapi';
import { ZodValidationPipe } from '../../zod.validation.pipe';
import { BaseQueryService } from './base-query/base-query.service';
import { BaseService } from './base.service';

@Controller('api/base/')
export class BaseController {
  constructor(
    private readonly baseService: BaseService,
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
