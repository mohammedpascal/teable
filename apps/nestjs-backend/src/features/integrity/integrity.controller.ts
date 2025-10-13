import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import type { IIntegrityCheckVo, IIntegrityIssue } from '@teable/openapi';
import { LinkIntegrityService } from './link-integrity.service';

@Controller('api/integrity')
export class IntegrityController {
  constructor(private readonly linkIntegrityService: LinkIntegrityService) {}

  @Get('base/:baseId/link-check')
  async checkBaseIntegrity(@Param('baseId') baseId: string): Promise<IIntegrityCheckVo> {
    return await this.linkIntegrityService.linkIntegrityCheck(baseId);
  }

  @Post('base/:baseId/link-fix')
  async fixBaseIntegrity(@Param('baseId') baseId: string): Promise<IIntegrityIssue[]> {
    return await this.linkIntegrityService.linkIntegrityFix(baseId);
  }
}
