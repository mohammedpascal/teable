import { Module } from '@nestjs/common';
import { AccessTokenService } from './access-token.service';

@Module({
  providers: [AccessTokenService],
  controllers: [],
  exports: [AccessTokenService],
})
export class AccessTokenModule {}
