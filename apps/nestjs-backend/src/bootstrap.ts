import 'dayjs/plugin/timezone';
import 'dayjs/plugin/utc';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import type { INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { WsAdapter } from '@nestjs/platform-ws';
import type { OpenAPIObject } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger';
import { getOpenApiDocumentation } from '@teable/openapi';
import { json, urlencoded } from 'express';
import helmet from 'helmet';
import isPortReachable from 'is-port-reachable';
import { Logger } from 'nestjs-pino';
import type { RedocOptions } from 'nestjs-redoc';
import { RedocModule } from 'nestjs-redoc';
import { AppModule } from './app.module';
import type { IBaseConfig } from './configs/base.config';
import type { ISecurityWebConfig, IApiDocConfig } from './configs/bootstrap.config';
import type { IStorageConfig } from './configs/storage';
import { GlobalExceptionFilter } from './filter/global-exception.filter';
import otelSDK from './tracing';

const execAsync = promisify(exec);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const module: any;

const host = 'localhost';

/**
 * Extract domain from URL for CSP connect-src directive
 * Handles URLs with or without protocol
 */
function extractDomainFromUrl(url: string | undefined): string | null {
  if (!url) {
    return null;
  }

  try {
    // If URL includes protocol, parse it
    if (url.includes('://')) {
      const urlObj = new URL(url);
      return urlObj.hostname;
    }
    // If it's just a domain, return as is
    return url;
  } catch {
    // If parsing fails, try to extract domain manually
    const match = url.match(/(?:https?:\/\/)?([^\/]+)/);
    return match ? match[1] : null;
  }
}

/**
 * Build connect-src sources for CSP based on storage provider configuration
 */
function buildConnectSrcSources(storageConfig: IStorageConfig | undefined): string[] {
  const sources: string[] = ["'self'"];

  if (!storageConfig) {
    return sources;
  }

  const { provider } = storageConfig;

  if (provider === 's3') {
    // Add standard AWS S3 patterns
    // CSP supports wildcards only at the beginning, so we use:
    // - *.s3.amazonaws.com for bucket.s3.amazonaws.com (us-east-1)
    // - *.amazonaws.com for all AWS S3 endpoints (bucket.s3.region.amazonaws.com, s3.region.amazonaws.com)
    sources.push('*.s3.amazonaws.com', '*.amazonaws.com');

    // Add custom S3 endpoints if configured (for S3-compatible services)
    const s3Endpoint = extractDomainFromUrl(storageConfig.s3?.endpoint);
    if (s3Endpoint && !s3Endpoint.includes('amazonaws.com')) {
      sources.push(s3Endpoint);
    }

    const s3InternalEndpoint = extractDomainFromUrl(storageConfig.s3?.internalEndpoint);
    if (
      s3InternalEndpoint &&
      s3InternalEndpoint !== s3Endpoint &&
      !s3InternalEndpoint.includes('amazonaws.com')
    ) {
      sources.push(s3InternalEndpoint);
    }
  } else if (provider === 'minio') {
    // Add MinIO endpoints if configured
    const minioEndpoint = extractDomainFromUrl(storageConfig.minio?.endPoint);
    if (minioEndpoint) {
      sources.push(minioEndpoint);
    }

    const minioInternalEndpoint = extractDomainFromUrl(storageConfig.minio?.internalEndPoint);
    if (minioInternalEndpoint && minioInternalEndpoint !== minioEndpoint) {
      sources.push(minioInternalEndpoint);
    }
  }
  // For 'local' provider, only 'self' is needed (already included)

  return sources;
}

export async function setUpAppMiddleware(app: INestApplication, configService: ConfigService) {
  app.useWebSocketAdapter(new WsAdapter(app));
  app.useGlobalFilters(new GlobalExceptionFilter(configService));
  app.useGlobalPipes(
    new ValidationPipe({ transform: true, stopAtFirstError: true, forbidUnknownValues: false })
  );

  const apiDocConfig = configService.get<IApiDocConfig>('apiDoc');
  const securityWebConfig = configService.get<ISecurityWebConfig>('security.web');
  const baseConfig = configService.get<IBaseConfig>('base');
  const storageConfig = configService.get<IStorageConfig>('storage');

  // In development, always allow localhost origins
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Enable CORS BEFORE helmet to prevent conflicts
  if (securityWebConfig?.cors.enabled) {
    // Build allowed origins list: config > PUBLIC_ORIGIN > default
    const configOrigins = securityWebConfig.cors.allowedOrigins;
    let allowedOrigins: string[] = [];

    if (configOrigins?.length) {
      allowedOrigins = configOrigins;
    } else if (baseConfig?.publicOrigin) {
      allowedOrigins = [baseConfig.publicOrigin];
    }

    app.enableCors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) {
          return callback(null, true);
        }

        // In development, allow any localhost origin
        if (
          isDevelopment &&
          (origin.startsWith('http://localhost:') ||
            origin.startsWith('http://127.0.0.1:') ||
            origin.startsWith('http://0.0.0.0:'))
        ) {
          return callback(null, true);
        }

        // Check if origin is in allowed list
        if (allowedOrigins.length > 0) {
          if (allowedOrigins.includes(origin)) {
            return callback(null, true);
          }
          // Origin not in allowed list
          return callback(new Error('Not allowed by CORS'), false);
        }

        // If no origins configured and not development, reject
        if (!isDevelopment) {
          return callback(new Error('CORS not configured'), false);
        }

        // Fallback: allow in development if we get here
        callback(null, true);
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'Accept',
        'Origin',
        'X-Requested-With',
        'Cookie',
        'Set-Cookie',
        'Access-Control-Request-Method',
        'Access-Control-Request-Headers',
        'x-window-id',
        'X-Window-Id',
      ],
      exposedHeaders: ['Set-Cookie'],
      preflightContinue: false,
      optionsSuccessStatus: 204,
    });
  }

  if (!isDevelopment || process.env.IS_LOCAL === 'true') {
    // Build connect-src sources for CSP based on storage configuration
    const connectSrcSources = buildConnectSrcSources(storageConfig);

    // Configure helmet to not interfere with CORS and allow storage connections
    app.use(
      helmet({
        crossOriginResourcePolicy: { policy: 'cross-origin' },
        contentSecurityPolicy: {
          directives: {
            'connect-src': connectSrcSources,
          },
        },
      })
    );
  }

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: true }));

  if (!apiDocConfig?.disabled) {
    const openApiDocumentation = await getOpenApiDocumentation({
      origin: baseConfig?.publicOrigin,
      snippet: apiDocConfig?.enabledSnippet,
    });

    const jsonString = JSON.stringify(openApiDocumentation);
    fs.writeFileSync(path.join(__dirname, '/openapi.json'), jsonString);
    SwaggerModule.setup('/docs', app, openApiDocumentation as OpenAPIObject);

    // Instead of using SwaggerModule.setup() you call this module
    const redocOptions: RedocOptions = {
      logo: {
        backgroundColor: '#F0F0F0',
        altText: 'Teable logo',
      },
    };
    await RedocModule.setup('/redocs', app, openApiDocumentation as OpenAPIObject, redocOptions);
  }
}

export async function bootstrap() {
  otelSDK.start();

  console.log('Process auto run migrations: ', process.env.NODE_ENV === 'development');

  // Auto-run migrations in development mode
  if (process.env.NODE_ENV === 'development') {
    // Always generate Prisma client
    try {
      console.log('🔄 Generating Prisma client...');
      await execAsync('npx prisma generate', {
        cwd: path.join(__dirname, '..'),
        env: process.env,
      });
      console.log('✅ Prisma client generated successfully');
    } catch (error) {
      console.error('❌ Failed to generate Prisma client:', error);
      // Don't exit the process, let the app start and handle the error
    }

    try {
      console.log('🔄 Running database migrations...');
      await execAsync('npx prisma migrate deploy', {
        cwd: path.join(__dirname, '..'),
        env: process.env,
      });
      console.log('✅ Database migrations completed successfully');
    } catch (error) {
      console.error('❌ Failed to run database migrations:', error);
      // Don't exit the process, let the app start and handle the error
    }
  }

  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const configService = app.get(ConfigService);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  const logger = app.get(Logger);
  app.useLogger(logger);
  app.flushLogs();

  app.enableShutdownHooks();

  await setUpAppMiddleware(app, configService);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  // app.getHttpServer().on('upgrade', async function (req: any, socket: any, head: any) {
  //   if (req.url.startsWith('/_next')) {
  //     console.log('upgrade: ', req.url);
  //     const server = app.get(NextService).server;
  //     return server.getUpgradeHandler()(req, socket, head);
  //   }
  // });

  const port = await getAvailablePort(configService.get<string>('PORT') as string);
  process.env.PORT = port.toString();

  await app.listen(port);

  const now = new Date();
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  logger.log(`> NODE_ENV is ${process.env.NODE_ENV}`);
  logger.log(`> Ready on http://${host}:${port}`);
  logger.log(`> System Time Zone: ${timeZone}`);
  logger.log(`> Current System Time: ${now.toString()}`);

  process.on('unhandledRejection', (reason: string, promise: Promise<unknown>) => {
    logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
    throw reason;
  });

  process.on('uncaughtException', (error) => {
    logger.error(error);
  });
  return app;
}

async function getAvailablePort(dPort: number | string): Promise<number> {
  let port = Number(dPort);
  while (await isPortReachable(port, { host })) {
    console.log(`> Fail on http://${host}:${port} Trying on ${port + 1}`);
    port++;
  }
  return port;
}
