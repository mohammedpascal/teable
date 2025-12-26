import { DriverClient } from '@teable/core';
import type { Knex } from 'knex';
import get from 'lodash/get';

export function getDriverName(knex: Knex | Knex.QueryBuilder) {
  return get(knex, 'client.config.client', '') as DriverClient;
}

export function isPostgreSQL(knex: Knex) {
  return getDriverName(knex) === DriverClient.Pg;
}
