import { Controller, Headers, Param, Post } from '@nestjs/common';
import type { IRedoVo, IUndoVo } from '@teable/openapi';
import { UndoRedoService } from './undo-redo.service';

@Controller('api/table/:tableId/undo-redo')
export class UndoRedoController {
  constructor(private readonly undoRedoService: UndoRedoService) {}

  @Post('undo')
  async undo(
    @Headers('x-window-id') windowId: string,
    @Param('tableId') tableId: string
  ): Promise<IUndoVo> {
    return await this.undoRedoService.undo(tableId, windowId);
  }

  @Post('redo')
  async redo(
    @Headers('x-window-id') windowId: string,
    @Param('tableId') tableId: string
  ): Promise<IRedoVo> {
    return await this.undoRedoService.redo(tableId, windowId);
  }
}
