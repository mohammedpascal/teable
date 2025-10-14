import { BullModule } from '@nestjs/bullmq';
import type { ModuleMetadata } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { ConditionalModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import type { ICacheConfig } from './configs/cache.config';
import { ConfigModule } from './configs/config.module';
import { AccessTokenModule } from './features/access-token/access-token.module';
import { AggregationOpenApiModule } from './features/aggregation/open-api/aggregation-open-api.module';
import { AttachmentsModule } from './features/attachments/attachments.module';
import { AuthModule } from './features/auth/auth.module';
import { BaseModule } from './features/base/base.module';
import { CollaboratorModule } from './features/collaborator/collaborator.module';
import { DashboardModule } from './features/dashboard/dashboard.module';
import { ExportOpenApiModule } from './features/export/open-api/export-open-api.module';
import { FieldOpenApiModule } from './features/field/open-api/field-open-api.module';
import { HealthModule } from './features/health/health.module';
import { ImportOpenApiModule } from './features/import/open-api/import-open-api.module';
import { IntegrityModule } from './features/integrity/integrity.module';
import { InvitationModule } from './features/invitation/invitation.module';
import { NextModule } from './features/next/next.module';
import { NotificationModule } from './features/notification/notification.module';
import { OAuthModule } from './features/oauth/oauth.module';
import { OrganizationModule } from './features/organization/organization.module';
import { PluginModule } from './features/plugin/plugin.module';
import { PluginContextMenuModule } from './features/plugin-context-menu/plugin-context-menu.module';
import { SelectionModule } from './features/selection/selection.module';
import { SettingModule } from './features/setting/setting.module';
import { UserModule } from './features/user/user.module';
import { GlobalModule } from './global/global.module';
import { InitBootstrapProvider } from './global/init-bootstrap.provider';
import { LoggerModule } from './logger/logger.module';
import { WsModule } from './ws/ws.module';

export const appModules = {
  imports: [
    LoggerModule.register(),
    HealthModule,
    NextModule,
    FieldOpenApiModule,
    BaseModule,
    IntegrityModule,
    AttachmentsModule,
    WsModule,
    SelectionModule,
    AggregationOpenApiModule,
    UserModule,
    AuthModule,
    CollaboratorModule,
    InvitationModule,
    NotificationModule,
    AccessTokenModule,
    ImportOpenApiModule,
    ExportOpenApiModule,
    SettingModule,
    OAuthModule,
    PluginModule,
    DashboardModule,
    OrganizationModule,
    PluginContextMenuModule,
  ],
  providers: [InitBootstrapProvider],
};

@Module({
  ...appModules,
  imports: [
    GlobalModule,
    ...appModules.imports,
    ConditionalModule.registerWhen(
      BullModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => {
          const redisUri = configService.get<ICacheConfig>('cache')?.redis.uri;
          if (!redisUri) {
            throw new Error('Redis URI is not defined');
          }
          const redis = new Redis(redisUri, { lazyConnect: true, maxRetriesPerRequest: null });
          await redis.connect();
          return {
            connection: redis,
          };
        },
        inject: [ConfigService],
      }),
      (env) => {
        return Boolean(env.BACKEND_CACHE_REDIS_URI);
      }
    ),
  ],
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
