import { Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import type { IClsStore } from '../../types/cls';
import type { IReadonlyAdapterService } from '../interface';
import { ReadonlyService } from './readonly.service';

@Injectable()
export class TableReadonlyServiceAdapter
  extends ReadonlyService
  implements IReadonlyAdapterService
{
  constructor(private readonly cls: ClsService<IClsStore>) {
    super(cls);
  }

  getDocIdsByQuery(_: string) {
    return this.axios
      .get(`/table/socket/doc-ids`, {
        headers: {
          cookie: this.cls.get('cookie'),
        },
      })
      .then((res) => res.data);
  }
  getSnapshotBulk(_: string, ids: string[]) {
    return this.axios
      .get(`/table/socket/snapshot-bulk`, {
        headers: {
          cookie: this.cls.get('cookie'),
        },
        params: {
          ids,
        },
      })
      .then((res) => res.data);
  }
}
