import type { OnModuleInit } from '@nestjs/common';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import type { Prisma } from '@prisma/client';
import { nanoid } from 'nanoid';
import type { ClsService } from 'nestjs-cls';
import { PostgresErrorCode, SqliteErrorCode } from './db.error';

interface ITx {
  client?: Prisma.TransactionClient;
  timeStr?: string;
  id?: string;
  rawOpMaps?: unknown;
}

export const wrapWithValidationErrorHandler = async (fn: () => Promise<unknown>) => {
  try {
    await fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    const code = e.meta?.code ?? e.code;
    if (code === PostgresErrorCode.UNIQUE_VIOLATION || code === SqliteErrorCode.UNIQUE_VIOLATION) {
      throw new HttpException(
        'Duplicate detected! Please ensure that all fields with unique value validation are indeed unique.',
        HttpStatus.BAD_REQUEST
      );
    }
    if (
      code === PostgresErrorCode.NOT_NULL_VIOLATION ||
      code === SqliteErrorCode.NOT_NULL_VIOLATION
    ) {
      throw new HttpException(
        'One or more required fields were not provided! Please ensure all mandatory fields are filled.',
        HttpStatus.BAD_REQUEST
      );
    }
    throw new HttpException(`An error occurred: ${e.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
  }
};

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, 'query'>
  implements OnModuleInit
{
  private readonly logger = new Logger(PrismaService.name);

  private afterTxCb?: () => void;

  constructor(private readonly cls: ClsService<{ tx: ITx }>) {
    const logConfig = {
      log: [
        {
          level: 'query',
          emit: 'event',
        },
        {
          level: 'error',
          emit: 'stdout',
        },
        {
          level: 'info',
          emit: 'stdout',
        },
        {
          level: 'warn',
          emit: 'stdout',
        },
      ],
    };
    const initialConfig = process.env.NODE_ENV === 'production' ? {} : { ...logConfig };

    super(initialConfig);
  }

  bindAfterTransaction(fn: () => void) {
    this.afterTxCb = fn;
  }

  /**
   * Executes a transaction using the provided function and options.
   * If a transaction client is already defined in the current context, the function is executed using it.
   * Otherwise, a new transaction is created and the function is executed using it.
   * @param fn The function to execute within the transaction.
   * @param options The options to use when creating the transaction.
   * @returns The result of the executed function.
   */
  async $tx<R = unknown>(
    fn: (prisma: Prisma.TransactionClient) => Promise<R>,
    options?: {
      maxWait?: number;
      timeout?: number;
      isolationLevel?: Prisma.TransactionIsolationLevel;
    }
  ): Promise<R> {
    let result: R = undefined as R;
    const txClient = this.cls.get('tx.client');
    if (txClient) {
      return await fn(txClient);
    }

    await this.cls.runWith(this.cls.get(), async () => {
      result = await super.$transaction<R>(async (prisma) => {
        this.cls.set('tx.client', prisma);
        this.cls.set('tx.id', nanoid());
        this.cls.set('tx.timeStr', new Date().toISOString());
        try {
          // can not delete await here
          return await fn(prisma);
        } finally {
          this.cls.set('tx.client', undefined);
          this.cls.set('tx.id', undefined);
          this.cls.set('tx.timeStr', undefined);
        }
      }, options);
      this.afterTxCb?.();
    });

    return result;
  }

  txClient(): Prisma.TransactionClient {
    const txClient = this.cls.get('tx.client');
    if (!txClient) {
      // console.log('transactionId', 'none');
      return this;
    }
    // const id = this.cls.get('tx.id');
    // console.log('transactionId', id);
    return txClient;
  }

  async onModuleInit() {
    await this.$connect();

    // 🔍 LOG DATABASE CONNECTION INFO
    const databaseUrl = process.env.PRISMA_DATABASE_URL || 'NOT SET!';
    const driver = databaseUrl.startsWith('file:')
      ? 'SQLite'
      : databaseUrl.startsWith('postgres')
        ? 'PostgreSQL'
        : 'Unknown';

    this.logger.log('='.repeat(80));
    this.logger.log(`🔍 PRISMA CONNECTED TO: ${driver}`);
    this.logger.log(`📍 Database URL: ${databaseUrl}`);
    this.logger.log(`🌍 Environment: ${process.env.NODE_ENV}`);
    this.logger.log('='.repeat(80));

    if (process.env.NODE_ENV === 'production') return;

    this.$on('query', async (e) => {
      this.logger.debug({
        // Query: e.query.trim().replace(/\s+/g, ' ').replace(/\( /g, '(').replace(/ \)/g, ')'),
        Query: e.query,
        Params: e.params,
        Duration: `${e.duration} ms`,
      });
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
