import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/guard/auth.guard';
import { AdminGuard } from '../auth/guard/admin.guard';
import { Admin } from '../auth/decorators/admin.decorator';
import { RoleService, type ICreateRoleDto, type IUpdateRoleDto } from './role.service';

@Controller('api/role')
@UseGuards(AuthGuard, AdminGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @Admin()
  async createRole(@Body() createRoleDto: ICreateRoleDto) {
    return this.roleService.createRole(createRoleDto);
  }

  @Get()
  @Admin()
  async getAllRoles() {
    return this.roleService.getAllRoles();
  }

  @Get(':id')
  @Admin()
  async getRole(@Param('id') id: string) {
    return this.roleService.getRole(id);
  }

  @Patch(':id')
  @Admin()
  async updateRole(@Param('id') id: string, @Body() updateRoleDto: IUpdateRoleDto) {
    return this.roleService.updateRole(id, updateRoleDto);
  }

  @Delete(':id')
  @Admin()
  async deleteRole(@Param('id') id: string) {
    return this.roleService.deleteRole(id);
  }
}

