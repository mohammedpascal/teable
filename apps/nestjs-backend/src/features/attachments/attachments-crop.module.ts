import { Module } from '@nestjs/common';
import { AttachmentsCropService } from './attachments-crop.processor';
import { AttachmentsStorageModule } from './attachments-storage.module';

@Module({
  providers: [AttachmentsCropService],
  imports: [AttachmentsStorageModule],
  exports: [AttachmentsCropService],
})
export class AttachmentsCropModule {}
