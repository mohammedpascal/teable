import { Controller, Get, Query } from '@nestjs/common';
import type { IGetBasePermissionVo } from '@teable/openapi';
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

  @Get('bse0/permission')
  async getPermission(): Promise<IGetBasePermissionVo> {
    return this.baseService.getPermission();
  }

  @Get('bse0/query')
  async sqlQuery(@Query(new ZodValidationPipe(baseQuerySchemaRo)) query: IBaseQuerySchemaRo) {
    return this.baseQueryService.baseQuery(query.query, query.cellFormat);
  }
}
