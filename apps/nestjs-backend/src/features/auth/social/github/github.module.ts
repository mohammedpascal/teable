import { Module } from '@nestjs/common';
import { UserModule } from '../../../user/user.module';
import { GithubStrategy } from '../../strategies/github.strategy';
import { OauthStoreService } from '../oauth-store.service';
import { GithubController } from './github.controller';

@Module({
  imports: [UserModule],
  providers: [GithubStrategy, OauthStoreService],
  exports: [],
  controllers: [GithubController],
})
export class GithubModule {}
