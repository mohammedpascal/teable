import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '@teable/db-main-prisma';
import { BaseDeleteEvent } from '../events';
// TODO: Space functionality not yet implemented
// import type { SpaceDeleteEvent, BaseDeleteEvent } from '../events';
import { Events } from '../events';

@Injectable()
export class PinListener {
  private readonly logger = new Logger(PinListener.name);

  constructor(private readonly prismaService: PrismaService) {}

  @OnEvent(Events.BASE_DELETE, { async: true })
  // TODO: Space functionality not yet implemented
  // @OnEvent(Events.SPACE_DELETE, { async: true })
  async baseDelete(listenerEvent: BaseDeleteEvent) {
    // TODO: Space functionality not yet implemented
    // let id: string = '';
    // if (listenerEvent.name === Events.SPACE_DELETE) {
    //   id = listenerEvent.payload.spaceId;
    // }
    const id = listenerEvent.payload.baseId;

    if (!id) {
      return;
    }

    await this.prismaService.pinResource.deleteMany({
      where: {
        resourceId: id,
      },
    });
  }
}
