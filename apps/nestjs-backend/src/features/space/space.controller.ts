// TODO: Space functionality not yet implemented
/* eslint-disable sonarjs/no-duplicate-string */
import { Controller } from '@nestjs/common';
// import {
//   Body,
//   Param,
//   Patch,
//   Post,
//   Get,
//   Delete,
// } from '@nestjs/common';
// import {
//   createIntegrationRoSchema,
//   ICreateIntegrationRo,
//   updateIntegrationRoSchema,
//   IUpdateIntegrationRo,
// } from '@teable/openapi';
// import { ZodValidationPipe } from '../../zod.validation.pipe';
// import { SpaceService } from './space.service';

// @Controller('api/base/')
// export class SpaceController {
//   constructor(
//     private readonly spaceService: SpaceService
//   ) {}

//   @Get(':baseId/integration')
//   async getIntegrationList(@Param('baseId') baseId: string) {
//     return this.spaceService.getIntegrationList(baseId);
//   }

//   @Post(':baseId/integration')
//   async createIntegration(
//     @Param('baseId') baseId: string,
//     @Body(new ZodValidationPipe(createIntegrationRoSchema))
//     addIntegrationRo: ICreateIntegrationRo
//   ) {
//     return this.spaceService.createIntegration(baseId, addIntegrationRo);
//   }

//   @Patch(':baseId/integration/:integrationId')
//   async updateIntegration(
//     @Param('baseId') baseId: string,
//     @Param('integrationId') integrationId: string,
//     @Body(new ZodValidationPipe(updateIntegrationRoSchema))
//     updateIntegrationRo: IUpdateIntegrationRo
//   ) {
//     return this.spaceService.updateIntegration(integrationId, updateIntegrationRo);
//   }

//   @Delete(':baseId/integration/:integrationId')
//   async deleteIntegration(
//     @Param('baseId') baseId: string,
//     @Param('integrationId') integrationId: string
//   ) {
//     return this.spaceService.deleteIntegration(integrationId);
//   }
// }

// Temporary empty controller to prevent import errors
@Controller('api/base/')
export class SpaceController {
  constructor() {}
}
