import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  IUpdateUserNameRo,
  IUserNotifyMeta,
  updateUserNameRoSchema,
  userNotifyMetaSchema,
} from '@teable/openapi';
import { ClsService } from 'nestjs-cls';
import { AuthGuard } from '../../features/auth/guard/auth.guard';
import { AdminGuard } from '../../features/auth/guard/admin.guard';
import { Admin } from '../../features/auth/decorators/admin.decorator';
import type { IClsStore } from '../../types/cls';
import { ZodValidationPipe } from '../../zod.validation.pipe';
import { UserService } from './user.service';

@Controller('api/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly cls: ClsService<IClsStore>
  ) {}

  @Patch('name')
  async updateName(
    @Body(new ZodValidationPipe(updateUserNameRoSchema)) updateUserNameRo: IUpdateUserNameRo
  ): Promise<void> {
    const userId = this.cls.get('user.id');
    return this.userService.updateUserName(userId, updateUserNameRo.name);
  }

  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (_req, file, callback) => {
        if (file.mimetype.startsWith('image/')) {
          callback(null, true);
        } else {
          callback(new BadRequestException('Invalid file type'), false);
        }
      },
      limits: {
        fileSize: 3 * 1024 * 1024, // limit file size is 3MB
      },
    })
  )
  @Patch('avatar')
  async updateAvatar(@UploadedFile() file: Express.Multer.File): Promise<void> {
    const userId = this.cls.get('user.id');
    return this.userService.updateAvatar(userId, file);
  }

  @Patch('notify-meta')
  async updateNotifyMeta(
    @Body(new ZodValidationPipe(userNotifyMetaSchema))
    updateUserNotifyMetaRo: IUserNotifyMeta
  ): Promise<void> {
    const userId = this.cls.get('user.id');
    return this.userService.updateNotifyMeta(userId, updateUserNotifyMetaRo);
  }

  @Get('list')
  @UseGuards(AuthGuard, AdminGuard)
  @Admin()
  async getUserList(
    @Query('skip') skip?: string,
    @Query('take') take?: string
  ) {
    const skipNum = skip ? parseInt(skip, 10) : 0;
    const takeNum = take ? parseInt(take, 10) : 100;
    return this.userService.getUserList(skipNum, takeNum);
  }

  @Post()
  @UseGuards(AuthGuard, AdminGuard)
  @Admin()
  async createUser(@Body() createUserRo: { name: string; email: string; password?: string; isAdmin?: boolean }) {
    if (!createUserRo.name || !createUserRo.email) {
      throw new BadRequestException('Name and email are required');
    }
    return this.userService.createUserAdmin(createUserRo);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, AdminGuard)
  @Admin()
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserRo: { name?: string; email?: string; isAdmin?: boolean }
  ) {
    return this.userService.updateUserAdmin(id, updateUserRo);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, AdminGuard)
  @Admin()
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
