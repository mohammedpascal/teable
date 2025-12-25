import path from 'path';
import type { INestApplication } from '@nestjs/common';
import { DriverClient, parseDsn } from '@teable/core';
import dotenv from 'dotenv-flow';
import { buildSync } from 'esbuild';

interface ITestConfig {
  driver: string;
  email: string;
  userName: string;
  userId: string;
  password: string;
}

interface IInitAppReturnType {
  app: INestApplication<unknown>;
  appUrl: string;
  cookie: string;
  sessionID: string;
}

declare global {
  // eslint-disable-next-line no-var
  var testConfig: ITestConfig;
  // eslint-disable-next-line no-var
  var initApp: undefined | (() => Promise<IInitAppReturnType>);
}

// Set global variables (if needed)
globalThis.testConfig = {
  userName: 'test',
  email: 'test@e2e.com',
  password: '12345678',
  userId: 'usrTestUserId',
  driver: DriverClient.Pg,
};

function compileWorkerFile() {
  const entryFile = path.join(__dirname, 'src/worker/**.ts');
  const outFile = path.join(__dirname, 'dist/worker');

  buildSync({
    entryPoints: [entryFile],
    outdir: outFile,
    bundle: true,
    platform: 'node',
    target: 'node20',
  });
}

async function setup() {
  dotenv.config({ path: '../nextjs-app' });

  const databaseUrl = process.env.PRISMA_DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('PRISMA_DATABASE_URL environment variable is not set');
  }

  console.log('database-url: ', databaseUrl);
  const { driver } = parseDsn(databaseUrl);
  console.log('driver: ', driver);
  globalThis.testConfig.driver = driver;

  compileWorkerFile();
}

export default setup();
