/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Prisma } from '../../';
import { AbstractSeed } from '../seed.abstract';

export class SpaceSeeds extends AbstractSeed {
  execute = async (): Promise<void> => {
    // Simple space seed implementation
    // This can be expanded later if needed
    this.log('CREATE', 'Space seeds executed (placeholder)');
  };
}
