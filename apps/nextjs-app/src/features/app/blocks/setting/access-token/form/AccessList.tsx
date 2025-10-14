import { useQuery } from '@tanstack/react-query';
import { X } from '@teable/icons';
import type { IGetBaseVo } from '@teable/openapi';
import { getBaseAll } from '@teable/openapi';
import { ReactQueryKeys } from '@teable/sdk/config';
import { Button } from '@teable/ui-lib/shadcn';
import { isEmpty } from 'lodash';
import { useMemo } from 'react';
import { Emoji } from '@/features/app/components/emoji/Emoji';

interface IAccessListProps {
  baseIds: string[];
  onDeleteBaseId: (baseId: string) => void;
}

export const AccessList = (props: IAccessListProps) => {
  const { baseIds, onDeleteBaseId } = props;

  const { data: baseList } = useQuery({
    queryKey: ReactQueryKeys.baseAll(),
    queryFn: () => getBaseAll().then((data) => data.data),
  });

  const baseMap = useMemo(() => {
    const baseMap: Record<string, IGetBaseVo> = {};
    baseList?.forEach((item) => {
      baseMap[item.id] = item;
    });
    return baseMap;
  }, [baseList]);

  const displayBases = useMemo(() => {
    if (isEmpty(baseMap)) {
      return [];
    }

    return baseIds.map((baseId) => baseMap[baseId]).filter(Boolean);
  }, [baseIds, baseMap]);

  return (
    <div className="py-3 pl-1 text-sm">
      {displayBases.map((base) => (
        <div key={base.id} className="flex h-8 items-center justify-between">
          <div className="flex items-center gap-2">
            <Emoji emoji={base.icon || ''} />
            <span>{base.name}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDeleteBaseId(base.id)}
            className="size-6 p-0"
          >
            <X className="size-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};
