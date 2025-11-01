import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { axios } from '../axios';
import { registerRoute, urlBuilder } from '../utils';

export enum UsageFeature {
  NumRows = 'numRows',
  AttachmentSize = 'attachmentSize',
  NumDatabaseConnections = 'numDatabaseConnections',
  NumCollaborators = 'numCollaborators',
}

export const usageFeatureSchema = z.object({
  [UsageFeature.NumRows]: z.number(),
  [UsageFeature.AttachmentSize]: z.number(),
  [UsageFeature.NumDatabaseConnections]: z.number(),
  [UsageFeature.NumCollaborators]: z.number(),
});

export enum UsageFeatureLimit {
  MaxRows = 'maxRows',
  MaxSizeAttachments = 'maxSizeAttachments',
  MaxNumDatabaseConnections = 'maxNumDatabaseConnections',
  MaxRevisionHistoryDays = 'maxRevisionHistoryDays',
  AuditLogEnable = 'auditLogEnable',
  AdminPanelEnable = 'adminPanelEnable',
  RowColoringEnable = 'rowColoringEnable',
  ButtonFieldEnable = 'buttonFieldEnable',
  UserGroupEnable = 'userGroupEnable',
  AdvancedExtensionsEnable = 'advancedExtensionsEnable',
  AdvancedPermissionsEnable = 'advancedPermissionsEnable',
  PasswordRestrictedSharesEnable = 'passwordRestrictedSharesEnable',
  AuthenticationEnable = 'authenticationEnable',
  DomainVerificationEnable = 'domainVerificationEnable',
  OrganizationEnable = 'organizationEnable',
}

export const usageFeatureLimitSchema = z.object({
  [UsageFeatureLimit.MaxRows]: z.number(),
  [UsageFeatureLimit.MaxSizeAttachments]: z.number(),
  [UsageFeatureLimit.MaxNumDatabaseConnections]: z.number(),
  [UsageFeatureLimit.MaxRevisionHistoryDays]: z.number(),
  [UsageFeatureLimit.AuditLogEnable]: z.boolean(),
  [UsageFeatureLimit.AdminPanelEnable]: z.boolean(),
  [UsageFeatureLimit.RowColoringEnable]: z.boolean(),
  [UsageFeatureLimit.ButtonFieldEnable]: z.boolean(),
  [UsageFeatureLimit.UserGroupEnable]: z.boolean(),
  [UsageFeatureLimit.AdvancedExtensionsEnable]: z.boolean(),
  [UsageFeatureLimit.AdvancedPermissionsEnable]: z.boolean(),
  [UsageFeatureLimit.PasswordRestrictedSharesEnable]: z.boolean(),
  [UsageFeatureLimit.AuthenticationEnable]: z.boolean(),
  [UsageFeatureLimit.DomainVerificationEnable]: z.boolean(),
  [UsageFeatureLimit.OrganizationEnable]: z.boolean(),
});

export const usageVoSchema = z.object({
  limit: usageFeatureLimitSchema,
});

export type IUsageVo = z.infer<typeof usageVoSchema>;

export const GET_BASE_USAGE = '/base/{baseId}/usage';

export const GetBaseUsageRoute: RouteConfig = registerRoute({
  method: 'get',
  path: GET_BASE_USAGE,
  description: 'Get usage information for the base',
  request: {
    params: z.object({
      baseId: z.string(),
    }),
  },
  responses: {
    200: {
      description: 'Returns usage information for the base.',
      content: {
        'application/json': {
          schema: usageVoSchema,
        },
      },
    },
  },
  tags: ['usage'],
});

export const getBaseUsage = async (baseId: string) => {
  return axios.get<IUsageVo>(urlBuilder(GET_BASE_USAGE, { baseId }));
};
