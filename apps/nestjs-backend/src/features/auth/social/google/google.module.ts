import { Module } from '@nestjs/common';
import { UserModule } from '../../../user/user.module';
import { GoogleStrategy } from '../../strategies/google.strategy';
import { OauthStoreService } from '../oauth-store.service';
import { GoogleController } from './google.controller';

@Module({
  imports: [UserModule],
  providers: [GoogleStrategy, OauthStoreService],
  exports: [],
  controllers: [GoogleController],
})
export class GoogleModule {}
