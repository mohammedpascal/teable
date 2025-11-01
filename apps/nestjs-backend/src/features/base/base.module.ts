import { Module } from '@nestjs/common';
import { DbProvider } from '../../db-provider/db.provider';
import { FieldModule } from '../field/field.module';
import { RecordModule } from '../record/record.module';
import { TableOpenApiModule } from '../table/open-api/table-open-api.module';
import { TableModule } from '../table/table.module';
import { BaseQueryService } from './base-query/base-query.service';
import { BaseController } from './base.controller';
import { BaseService } from './base.service';

@Module({
  controllers: [BaseController],
  imports: [
    FieldModule,
    TableModule,
    TableOpenApiModule,
    RecordModule,
  ],
  providers: [DbProvider, BaseService, BaseQueryService],
  exports: [BaseService],
})
export class BaseModule {}
