/* eslint-disable @typescript-eslint/naming-convention */
import type { ConfigType } from '@nestjs/config';
import { registerAs } from '@nestjs/config';

export const securityWebConfig = registerAs('security.web', () => ({
  cors: {
    enabled: true,
    allowedOrigins: process.env.CORS_ALLOWED_ORIGINS
      ? process.env.CORS_ALLOWED_ORIGINS.split(',').map((origin) => origin.trim())
      : undefined,
  },
}));

export const tracingConfig = registerAs('tracing', () => ({
  enabled: process.env.TRACING_ENABLED === 'true',
}));

export const apiDocConfig = registerAs('apiDoc', () => ({
  disabled: process.env.API_DOC_DISENABLED === 'true',
  enabledSnippet: process.env.API_DOC_ENABLED_SNIPPET === 'true',
}));

export type ISecurityWebConfig = ConfigType<typeof securityWebConfig>;
export type IApiDocConfig = ConfigType<typeof apiDocConfig>;
export const bootstrapConfigs = [securityWebConfig, apiDocConfig];
