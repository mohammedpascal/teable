/* eslint-disable @typescript-eslint/naming-convention */
import * as fs from 'fs';
import path from 'path';
import type { DynamicModule } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { ConfigModule as BaseConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv';
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
    // Load .env file from the nestjs-backend directory
    const envPath = path.join(process.cwd(), './.env');
    console.log('🔍 Loading .env from:', envPath);

    // Load the .env file
    if (fs.existsSync(envPath)) {
      dotenv.config({ path: envPath });
    }
    console.log('  NODE_ENV:', process.env.NODE_ENV);
    console.log('  PRISMA_DATABASE_URL:', process.env.PRISMA_DATABASE_URL);
    console.log('  PUBLIC_ORIGIN:', process.env.PUBLIC_ORIGIN);
    console.log('  BRAND_NAME:', process.env.BRAND_NAME);
    console.log('  NEXTJS_DIR:', process.env.NEXTJS_DIR);
    console.log('🔗 Database URL loaded:', process.env.PRISMA_DATABASE_URL ? '✅ Yes' : '❌ No');

    return BaseConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      load: configurations,
      envFilePath: [envPath],
      validationSchema: envValidationSchema,
    });
  }
}
