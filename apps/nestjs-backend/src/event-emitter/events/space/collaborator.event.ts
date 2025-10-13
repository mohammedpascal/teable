// TODO: Multi-user collaboration functionality removed
// import { Events } from '../event.enum';

// export class CollaboratorCreateEvent {
//   public readonly name = Events.COLLABORATOR_CREATE;

//   constructor(public readonly spaceId: string) {}
// }

// export class CollaboratorDeleteEvent {
//   public readonly name = Events.COLLABORATOR_DELETE;

//   constructor(public readonly spaceId: string) {}
// }

// Temporary empty exports to prevent import errors
export class CollaboratorCreateEvent {
  public readonly name = 'COLLABORATOR_CREATE';
  constructor(public readonly spaceId: string) {}
}

export class CollaboratorDeleteEvent {
  public readonly name = 'COLLABORATOR_DELETE';
  constructor(public readonly spaceId: string) {}
}
