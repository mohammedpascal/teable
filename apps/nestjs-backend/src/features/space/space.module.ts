import { Module } from '@nestjs/common';
import { BaseModule } from '../base/base.module';
import { CollaboratorModule } from '../collaborator/collaborator.module';
import { InvitationModule } from '../invitation/invitation.module';
import { SpaceController } from './space.controller';
import { SpaceService } from './space.service';

@Module({
  controllers: [SpaceController],
  providers: [SpaceService],
  exports: [SpaceService],
  imports: [CollaboratorModule, InvitationModule, BaseModule],
})
export class SpaceModule {}
