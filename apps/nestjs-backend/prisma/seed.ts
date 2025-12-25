/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ParseArgsConfig } from 'node:util';
import { parseArgs } from 'node:util';
import { PrismaClient } from '@prisma/client';
import { UserSeeds } from '../src/prisma/seeds/e2e/user-seeds';

export type IDsn = {
  host: string;
  driver: string;
  port?: number;
};

export function parseDsn(dsn: string): IDsn {
  if (dsn.startsWith('postgres')) {
    const url = new URL(dsn);
    return {
      host: url.hostname,
      driver: 'postgresql',
      port: parseInt(url.port) || 5432,
    };
  }

  throw new Error(`Unsupported database URL: ${dsn}`);
}

let prisma: PrismaClient | undefined;

const options: ParseArgsConfig['options'] = {
  e2e: { type: 'boolean', default: false },
  log: { type: 'boolean', default: false },
};

async function main() {
  const {
    values: { e2e, log },
  } = parseArgs({ options }) as unknown as { values: { e2e: boolean; log: boolean } };
  const databaseUrl = process.env.PRISMA_DATABASE_URL!;
  const { driver } = parseDsn(databaseUrl);

  console.log('🌱         Seed E2E: ', e2e);
  console.log('🌱      Environment: ', process.env.NODE_ENV);
  console.log('🌱     Database Url: ', databaseUrl);
  console.log('🌱  Database Driver: ', driver);

  prisma = new PrismaClient();

  if (e2e) {
    const userSeeds = new UserSeeds(prisma, driver as any, Boolean(log));
    await userSeeds.execute();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma?.$disconnect();
  });
