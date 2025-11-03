import { Controller, Get, Post } from '@nestjs/common';
import type { IIntegrityCheckVo, IIntegrityIssue } from '@teable/openapi';
import { LinkIntegrityService } from './link-integrity.service';

@Controller('api/integrity')
export class IntegrityController {
  constructor(private readonly linkIntegrityService: LinkIntegrityService) {}

  @Get('base/bse0/link-check')
  async checkBaseIntegrity(): Promise<IIntegrityCheckVo> {
    return await this.linkIntegrityService.linkIntegrityCheck('bse0');
  }

  @Post('base/bse0/link-fix')
  async fixBaseIntegrity(): Promise<IIntegrityIssue[]> {
    return await this.linkIntegrityService.linkIntegrityFix('bse0');
  }
}
