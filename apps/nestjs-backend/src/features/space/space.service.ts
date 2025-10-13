// TODO: Space functionality not yet implemented
// import { Injectable } from '@nestjs/common';
// import {
//   generateIntegrationId,
// } from '@teable/core';
// import { PrismaService } from '@teable/db-main-prisma';
// import type {
//   ICreateIntegrationRo,
//   IIntegrationItemVo,
//   IUpdateIntegrationRo,
// } from '@teable/openapi';
// import { IntegrationType } from '@teable/openapi';
// import { ThresholdConfig, IThresholdConfig } from '../../configs/threshold.config';
// import { BaseService } from '../base/base.service';

// @Injectable()
// export class SpaceService {
//   constructor(
//     private readonly prismaService: PrismaService,
//     private readonly baseService: BaseService,
//     @ThresholdConfig() private readonly thresholdConfig: IThresholdConfig
//   ) {}

//   async getIntegrationList(baseId: string): Promise<IIntegrationItemVo[]> {
//     const integrationList = await this.prismaService.integration.findMany({
//       where: { resourceId: baseId },
//     });
//     return integrationList.map(({ id, config, type, enable, createdTime, lastModifiedTime }) => {
//       return {
//         id,
//         baseId,
//         type: type as IntegrationType,
//         enable: enable ?? false,
//         config: JSON.parse(config),
//         createdTime: createdTime.toISOString(),
//         lastModifiedTime: lastModifiedTime?.toISOString(),
//       };
//     });
//   }

//   async createIntegration(baseId: string, addIntegrationRo: ICreateIntegrationRo) {
//     const { type, enable, config } = addIntegrationRo;

//     if (type === IntegrationType.AI) {
//       const aiIntegration = await this.prismaService.integration.findFirst({
//         where: {
//           resourceId: baseId,
//           type: IntegrationType.AI,
//         },
//       });

//       if (!aiIntegration) {
//         return await this.prismaService.integration.create({
//           data: {
//             id: generateIntegrationId(),
//             resourceId: baseId,
//             type,
//             enable,
//             config: JSON.stringify(config),
//           },
//         });
//       }

//       const { id, enable: originalEnable } = aiIntegration;
//       const originalConfig = JSON.parse(aiIntegration.config);

//       return await this.prismaService.integration.update({
//         where: { id },
//         data: {
//           config: JSON.stringify({
//             ...originalConfig,
//             ...config,
//             llmProviders: [...originalConfig.llmProviders, ...config.llmProviders],
//           }),
//           enable: enable ?? originalEnable,
//         },
//       });
//     }

//     return await this.prismaService.integration.create({
//       data: {
//         id: generateIntegrationId(),
//         resourceId: baseId,
//         type,
//         enable,
//         config: JSON.stringify(config),
//       },
//     });
//   }

//   async updateIntegration(integrationId: string, updateIntegrationRo: IUpdateIntegrationRo) {
//     const { enable, config } = updateIntegrationRo;
//     const updateData: Record<string, unknown> = {};
//     if (enable != null) {
//       updateData.enable = enable;
//     }
//     if (config) {
//       updateData.config = JSON.stringify(config);
//     }
//     return await this.prismaService.integration.update({
//       where: { id: integrationId },
//       data: updateData,
//     });
//   }

//   async deleteIntegration(integrationId: string) {
//     await this.prismaService.integration.delete({
//       where: { id: integrationId },
//     });
//   }
// }

// Temporary empty service to prevent import errors
import { Injectable } from '@nestjs/common';

@Injectable()
export class SpaceService {
  constructor() {}
}
