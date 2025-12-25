/* eslint-disable @typescript-eslint/naming-convention */
import type { Provider } from '@nestjs/common';
import type { Knex } from 'knex';
import { InitBootstrapService } from './init-bootstrap.service';

export const InitBootstrapProvider: Provider = {
  provide: InitBootstrapService,
  useFactory: async (knex: Knex) => {
    const initBootstrapService = new InitBootstrapService(knex);

    await initBootstrapService.init();

    return initBootstrapService;
  },
  inject: ['CUSTOM_KNEX'],
};
