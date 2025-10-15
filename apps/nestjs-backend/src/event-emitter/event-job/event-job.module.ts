import type { DynamicModule } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { FallbackQueueModule } from './fallback/fallback-queue.module';

@Module({})
export class EventJobModule {
  static async registerQueue(name: string): Promise<DynamicModule> {
    return FallbackQueueModule.registerQueue(name);
  }
}
