/* eslint-disable @typescript-eslint/naming-convention */
import type { Provider } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { DriverClient } from '@teable/core';
import type { Knex } from 'knex';
import { getDriverName } from '../utils/db-helpers';
import { PostgresProvider } from './postgres.provider';

export const DB_PROVIDER_SYMBOL = Symbol('DB_PROVIDER');

export const InjectDbProvider = () => Inject(DB_PROVIDER_SYMBOL);

export const DbProvider: Provider = {
  provide: DB_PROVIDER_SYMBOL,
  useFactory: (knex: Knex) => {
    const driverClient = getDriverName(knex);
    switch (driverClient) {
      case DriverClient.Pg:
        return new PostgresProvider(knex);
      default:
        throw new Error(`Unsupported database driver: ${driverClient}`);
    }
  },
  inject: ['CUSTOM_KNEX'],
};
