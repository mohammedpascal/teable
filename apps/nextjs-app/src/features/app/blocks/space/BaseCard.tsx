import { Database } from '@teable/icons';
import type { IGetBaseVo } from '@teable/openapi';
import { Card, CardContent, cn } from '@teable/ui-lib/shadcn';
import { useRouter } from 'next/router';
import { type FC } from 'react';

interface IBaseCard {
  base: IGetBaseVo;
  className?: string;
}

export const BaseCard: FC<IBaseCard> = (props) => {
  const { base, className } = props;
  const router = useRouter();

  const intoBase = () => {
    router.push({
      pathname: '/base/[baseId]',
      query: {
        baseId: base.id,
      },
    });
  };

  return (
    <Card
      onClick={intoBase}
      className={cn('group cursor-pointer hover:shadow-md overflow-x-hidden', className)}
    >
      <CardContent className="flex size-full items-center gap-3 px-4 py-6">
        <div>
          <Database className="size-14 min-w-14" />
        </div>
        <div className="h-full flex-1">
          <div className="relative flex justify-between gap-3 p-0.5">
            <h3 className="line-clamp-2 flex-1" title={base.name}>
              {base.name}
            </h3>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
