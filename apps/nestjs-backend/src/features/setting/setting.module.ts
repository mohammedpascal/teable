import { Module } from '@nestjs/common';
import { AttachmentsCropModule } from '../attachments/attachments-crop.module';
import { SettingController } from './setting.controller';
import { SettingService } from './setting.service';

@Module({
  imports: [AttachmentsCropModule],
  controllers: [SettingController],
  exports: [SettingService],
  providers: [SettingService],
})
export class SettingModule {}
