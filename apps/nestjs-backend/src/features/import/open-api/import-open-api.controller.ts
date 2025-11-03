import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import type { IAnalyzeVo, ITableFullVo } from '@teable/openapi';
import {
  analyzeRoSchema,
  IAnalyzeRo,
  IImportOptionRo,
  IInplaceImportOptionRo,
  importOptionRoSchema,
  inplaceImportOptionRoSchema,
} from '@teable/openapi';
import { ZodValidationPipe } from '../../../zod.validation.pipe';
import { TokenAccess } from '../../auth/decorators/token.decorator';

import { ImportOpenApiService } from './import-open-api.service';

@Controller('api/import')
export class ImportController {
  constructor(private readonly importOpenService: ImportOpenApiService) {}
  @Get('/analyze')
  @TokenAccess()
  async analyzeSheetFromFile(
    @Query(new ZodValidationPipe(analyzeRoSchema)) analyzeRo: IAnalyzeRo
  ): Promise<IAnalyzeVo> {
    return await this.importOpenService.analyze(analyzeRo);
  }

  @Post('')
  async createTableFromImport(
    @Body(new ZodValidationPipe(importOptionRoSchema)) importRo: IImportOptionRo
  ): Promise<ITableFullVo[]> {
    return await this.importOpenService.createTableFromImport('bse0', importRo);
  }

  @Patch('bse0/:tableId')
  async inplaceImportTable(
    @Param('tableId') tableId: string,
    @Body(new ZodValidationPipe(inplaceImportOptionRoSchema))
    inplaceImportRo: IInplaceImportOptionRo
  ): Promise<void> {
    return await this.importOpenService.inplaceImportTable('bse0', tableId, inplaceImportRo);
  }
}
