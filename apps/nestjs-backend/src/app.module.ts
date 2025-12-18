import type { ModuleMetadata } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { AggregationOpenApiModule } from './features/aggregation/open-api/aggregation-open-api.module';
import { AttachmentsModule } from './features/attachments/attachments.module';
import { AuthModule } from './features/auth/auth.module';
import { DashboardModule } from './features/dashboard/dashboard.module';
import { ExportOpenApiModule } from './features/export/open-api/export-open-api.module';
import { FieldModule } from './features/field/field.module';
import { FieldOpenApiModule } from './features/field/open-api/field-open-api.module';
import { HealthModule } from './features/health/health.module';
import { ImportOpenApiModule } from './features/import/open-api/import-open-api.module';
import { IntegrityModule } from './features/integrity/integrity.module';
import { NotificationModule } from './features/notification/notification.module';
import { RecordModule } from './features/record/record.module';
import { RoleModule } from './features/role/role.module';
import { SelectionModule } from './features/selection/selection.module';
import { SettingModule } from './features/setting/setting.module';
import { TableOpenApiModule } from './features/table/open-api/table-open-api.module';
import { TableModule } from './features/table/table.module';
import { UserModule } from './features/user/user.module';
import { GlobalModule } from './global/global.module';
import { InitBootstrapProvider } from './global/init-bootstrap.provider';
import { LoggerModule } from './logger/logger.module';
import { WsModule } from './ws/ws.module';

export const appModules = {
  imports: [
    LoggerModule.register(),
    HealthModule,
    FieldOpenApiModule,
    FieldModule,
    TableModule,
    TableOpenApiModule,
    RecordModule,
    IntegrityModule,
    AttachmentsModule,
    WsModule,
    SelectionModule,
    AggregationOpenApiModule,
    UserModule,
    RoleModule,
    AuthModule,
    NotificationModule,
    ImportOpenApiModule,
    ExportOpenApiModule,
    SettingModule,
    DashboardModule,
  ],
  providers: [InitBootstrapProvider],
};

@Module({
  ...appModules,
  imports: [GlobalModule, ...appModules.imports],
  controllers: [],
})
export class AppModule {
  static register(customModuleMetadata: ModuleMetadata) {
    return {
      module: AppModule,
      ...customModuleMetadata,
    };
  }
}
