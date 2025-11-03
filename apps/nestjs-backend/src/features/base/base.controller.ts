import { Controller, Get, Query } from '@nestjs/common';
import type { IGetBasePermissionVo, IGetBaseVo } from '@teable/openapi';
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
  async getBaseById(): Promise<IGetBaseVo> {
    return {
      id: 'bse0',
      name: 'Base',
    };
  }

  @Get(':baseId/permission')
  async getPermission(): Promise<IGetBasePermissionVo> {
    return this.baseService.getPermission();
  }

  @Get(':baseId/query')
  async sqlQuery(@Query(new ZodValidationPipe(baseQuerySchemaRo)) query: IBaseQuerySchemaRo) {
    return this.baseQueryService.baseQuery(query.query, query.cellFormat);
  }
}
