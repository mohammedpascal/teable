import { Module } from '@nestjs/common';
import { DbProvider } from '../../db-provider/db.provider';
import { FieldModule } from '../field/field.module';
import { RecordModule } from '../record/record.module';
import { TableOpenApiModule } from '../table/open-api/table-open-api.module';
import { TableModule } from '../table/table.module';
import { BaseController } from './base.controller';

@Module({
  controllers: [BaseController],
  imports: [FieldModule, TableModule, TableOpenApiModule, RecordModule],
  providers: [DbProvider],
})
export class BaseModule {}
