import { match } from 'ts-pattern';
import type { IEventContext } from '../core-event';
import { CoreEvent } from '../core-event';
import { Events } from '../event.enum';

type IBaseCreatePayload = { base: { id: string; name: string } };
type IBaseDeletePayload = Record<string, never>;
type IBaseUpdatePayload = IBaseCreatePayload;
type IBasePermissionUpdatePayload = Record<string, never>;

export class BaseCreateEvent extends CoreEvent<IBaseCreatePayload> {
  public readonly name = Events.BASE_CREATE;

  constructor(base: { id: string; name: string }, context: IEventContext) {
    super({ base }, context);
  }
}

export class BaseDeleteEvent extends CoreEvent<IBaseDeletePayload> {
  public readonly name = Events.BASE_DELETE;
  constructor(context: IEventContext) {
    super({}, context);
  }
}

export class BaseUpdateEvent extends CoreEvent<IBaseUpdatePayload> {
  public readonly name = Events.BASE_UPDATE;

  constructor(base: { id: string; name: string }, context: IEventContext) {
    super({ base }, context);
  }
}

export class BasePermissionUpdateEvent extends CoreEvent<IBasePermissionUpdatePayload> {
  public readonly name = Events.BASE_PERMISSION_UPDATE;

  constructor(context: IEventContext) {
    super({}, context);
  }
}

export class BaseEventFactory {
  static create(
    name: string,
    payload: IBaseCreatePayload | IBaseDeletePayload | IBaseUpdatePayload,
    context: IEventContext
  ) {
    return match(name)
      .with(Events.BASE_CREATE, () => {
        const { base } = payload as IBaseCreatePayload;
        return new BaseCreateEvent(base, context);
      })
      .with(Events.BASE_DELETE, () => {
        return new BaseDeleteEvent(context);
      })
      .with(Events.BASE_UPDATE, () => {
        const { base } = payload as IBaseUpdatePayload;
        return new BaseUpdateEvent(base, context);
      })
      .with(Events.BASE_PERMISSION_UPDATE, () => {
        return new BasePermissionUpdateEvent(context);
      })
      .otherwise(() => null);
  }
}
