import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';

@Injectable()
export class InitBootstrapService {
  constructor(@InjectModel('CUSTOM_KNEX') private readonly knex: Knex) {}

  async init() {
    // No initialization needed for PostgreSQL
  }
}
