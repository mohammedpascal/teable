/* eslint-disable @typescript-eslint/naming-convention */
import type { DynamicModule } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { ConfigModule as BaseConfigModule } from '@nestjs/config';
import { config } from 'dotenv';
import { authConfig } from './auth.config';
import { baseConfig } from './base.config';
import { bootstrapConfigs } from './bootstrap.config';
import { cacheConfig } from './cache.config';
import { envValidationSchema } from './env.validation.schema';
import { loggerConfig } from './logger.config';
import { mailConfig } from './mail.config';
import { oauthConfig } from './oauth.config';
import { storageConfig } from './storage';
import { thresholdConfig } from './threshold.config';

config();

console.log('🔍 Config module loaded:', process.env.PRISMA_DATABASE_URL);

const configurations = [
  ...bootstrapConfigs,
  loggerConfig,
  mailConfig,
  authConfig,
  baseConfig,
  storageConfig,
  thresholdConfig,
  cacheConfig,
  oauthConfig,
];

@Module({})
export class ConfigModule {
  static register(): DynamicModule {
    return BaseConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      load: configurations,
      validationSchema: envValidationSchema,
    });
  }
}
