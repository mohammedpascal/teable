/* eslint-disable @typescript-eslint/naming-convention */
import type { ConfigType } from '@nestjs/config';
import { registerAs } from '@nestjs/config';

export const securityWebConfig = registerAs('security.web', () => {
  // Enable CORS by default in development, allow explicit override via env var
  const isDevelopment = process.env.NODE_ENV === 'development';
  const corsEnabledEnv = process.env.CORS_ENABLED;
  const corsEnabled =
    corsEnabledEnv !== undefined
      ? corsEnabledEnv === 'true'
      : isDevelopment; // Default to enabled in development

  return {
    cors: {
      enabled: corsEnabled,
      allowedOrigins: process.env.CORS_ALLOWED_ORIGINS
        ? process.env.CORS_ALLOWED_ORIGINS.split(',').map((origin) => origin.trim())
        : undefined,
    },
  };
});

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
