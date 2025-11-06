import { customAlphabet } from 'nanoid';

export enum IdPrefix {
  Base = 'bse',

  Table = 'tbl',
  Field = 'fld',
  View = 'viw',
  Record = 'rec',
  Attachment = 'act',
  Choice = 'cho',

  User = 'usr',
  Account = 'aco',

  Share = 'shr',

  Notification = 'not',

  AccessToken = 'acc',

  OAuthClient = 'clt',

  Window = 'win',

  Dashboard = 'dsh',

  Operation = 'opr',
}

const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const nanoid = customAlphabet(chars);

export function getRandomString(len: number) {
  return nanoid(len);
}

export function generateTableId() {
  return IdPrefix.Table + getRandomString(16);
}

export function generateFieldId() {
  return IdPrefix.Field + getRandomString(16);
}

export function generateViewId() {
  return IdPrefix.View + getRandomString(16);
}

export function generateRecordId() {
  return IdPrefix.Record + getRandomString(16);
}

export function generateChoiceId() {
  return IdPrefix.Choice + getRandomString(8);
}

export function generateAttachmentId() {
  return IdPrefix.Attachment + getRandomString(16);
}

export function generateUserId() {
  return IdPrefix.User + getRandomString(16);
}

export function generateWindowId() {
  return IdPrefix.Window + getRandomString(16);
}

export function identify(id: string): IdPrefix | undefined {
  if (id.length < 2) {
    return undefined;
  }

  const idPrefix = id.substring(0, 3);
  return (Object.values(IdPrefix) as string[]).includes(idPrefix)
    ? (idPrefix as IdPrefix)
    : undefined;
}

export function generateShareId() {
  return IdPrefix.Share + getRandomString(16);
}

export function generateNotificationId() {
  return IdPrefix.Notification + getRandomString(16);
}

export function generateAccessTokenId() {
  return IdPrefix.AccessToken + getRandomString(16);
}

export function generateAccountId() {
  return IdPrefix.Account + getRandomString(16);
}

export function generateClientId() {
  return IdPrefix.OAuthClient + getRandomString(16).toLocaleLowerCase();
}

export function generateDashboardId() {
  return IdPrefix.Dashboard + getRandomString(12);
}

export function generateOperationId() {
  return IdPrefix.Operation + getRandomString(16);
}
