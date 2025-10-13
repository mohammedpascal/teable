import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { FieldType, IdPrefix, ViewType } from '@teable/core';
import { axios } from '../axios';
import { userCollaboratorItem } from '../types/collaborator';
import { registerRoute } from '../utils';
import { z } from '../zod';

export const GET_TRASH = '/trash';

export enum ResourceType {
  Base = 'base',
  Table = 'table',
  View = 'view',
  Field = 'field',
  Record = 'record',
}

export const userMapVoSchema = z.record(
  z.string().startsWith(IdPrefix.User),
  userCollaboratorItem
    .pick({
      email: true,
      avatar: true,
    })
    .merge(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    )
);

const fieldSnapshotItemVoSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.nativeEnum(FieldType),
  isLookup: z.boolean().nullable(),
  options: z.array(z.string()).nullish(),
});

const recordSnapshotItemVoSchema = z.object({
  id: z.string(),
  name: z.string(),
});

const viewSnapshotItemVoSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.nativeEnum(ViewType),
});

export const resourceMapVoSchema = z.record(
  z.string(),
  z.union([
    z.object({
      id: z.string().startsWith(IdPrefix.Base),
      name: z.string(),
    }),
    z.object({
      id: z.string().startsWith(IdPrefix.Table),
      name: z.string(),
    }),
    viewSnapshotItemVoSchema,
    fieldSnapshotItemVoSchema,
    recordSnapshotItemVoSchema,
  ])
);

export type IViewSnapshotItemVo = z.infer<typeof viewSnapshotItemVoSchema>;
export type IFieldSnapshotItemVo = z.infer<typeof fieldSnapshotItemVoSchema>;
export type IRecordSnapshotItemVo = z.infer<typeof recordSnapshotItemVoSchema>;

export type IResourceMapVo = z.infer<typeof resourceMapVoSchema>;

export const trashRoSchema = z.object({
  resourceType: z.enum([ResourceType.Base]),
});

export type ITrashRo = z.infer<typeof trashRoSchema>;

export const trashItemVoSchema = z.object({
  id: z.string(),
  resourceId: z.string(),
  resourceType: z.enum([ResourceType.Base, ResourceType.Table]),
  deletedTime: z.string(),
  deletedBy: z.string(),
});

export const tableTrashItemVoSchema = z.object({
  id: z.string(),
  resourceIds: z.array(z.string()),
  resourceType: z.enum([ResourceType.View, ResourceType.Field, ResourceType.Record]),
  deletedTime: z.string(),
  deletedBy: z.string(),
});

export type ITrashItemVo = z.infer<typeof trashItemVoSchema>;
export type ITableTrashItemVo = z.infer<typeof tableTrashItemVoSchema>;

export const trashVoSchema = z.object({
  trashItems: z.array(z.union([trashItemVoSchema, tableTrashItemVoSchema])),
  userMap: userMapVoSchema,
  resourceMap: resourceMapVoSchema,
  nextCursor: z.string().nullish(),
});

export type ITrashVo = z.infer<typeof trashVoSchema>;

export const GetTrashRoute: RouteConfig = registerRoute({
  method: 'get',
  path: GET_TRASH,
  description: 'Get trash list for bases',
  request: {
    query: trashRoSchema,
  },
  responses: {
    200: {
      description: 'Get trash successfully',
      content: {
        'application/json': {
          schema: trashVoSchema,
        },
      },
    },
  },
  tags: ['trash'],
});

export const getTrash = (trashRo: ITrashRo) => {
  return axios.get<ITrashVo>(GET_TRASH, { params: trashRo });
};
