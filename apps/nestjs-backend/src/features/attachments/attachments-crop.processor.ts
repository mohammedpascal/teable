import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@teable/db-main-prisma';
import { EventEmitterService } from '../../event-emitter/event-emitter.service';
import { Events } from '../../event-emitter/events';
import { AttachmentsStorageService } from '../attachments/attachments-storage.service';

interface IRecordImageData {
  bucket: string;
  token: string;
  path: string;
  mimetype: string;
  height?: number | null;
}

@Injectable()
export class AttachmentsCropService {
  private logger = new Logger(AttachmentsCropService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly attachmentsStorageService: AttachmentsStorageService,
    private readonly eventEmitterService: EventEmitterService
  ) {}

  public async process(data: IRecordImageData) {
    await this.handleCropImage(data);
    await this.eventEmitterService.emitAsync(Events.CROP_IMAGE_COMPLETE, {
      token: data.token,
    });
  }

  private async handleCropImage(data: IRecordImageData) {
    const { bucket, token, path, mimetype, height } = data;
    if (mimetype.startsWith('image/') && height) {
      const existingThumbnailPath = await this.prismaService.attachments.findUnique({
        where: { token },
        select: { thumbnailPath: true },
      });
      if (existingThumbnailPath?.thumbnailPath) {
        this.logger.log(`path(${path}) image already has thumbnail`);
        return;
      }
      const { lgThumbnailPath, smThumbnailPath } =
        await this.attachmentsStorageService.cropTableImage(bucket, path, height);
      await this.prismaService.attachments.update({
        where: {
          token,
        },
        data: {
          thumbnailPath: JSON.stringify({
            lg: lgThumbnailPath,
            sm: smThumbnailPath,
          }),
        },
      });
      this.logger.log(`path(${path}) crop thumbnails success`);
      return;
    }
    this.logger.log(`path(${path}) is not a image`);
  }
}
