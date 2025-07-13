import type { IGetBaseVo, IGetSpaceVo, ISubscriptionSummaryVo } from '@teable/openapi';
import { Card, CardContent, CardHeader, CardTitle } from '@teable/ui-lib/shadcn';
import { useTranslation } from 'next-i18next';
import { type FC } from 'react';
import { spaceConfig } from '@/features/i18n/space.config';
import { DraggableBaseGrid } from './DraggableBaseGrid';

interface ISpaceCard {
  space: IGetSpaceVo;
  bases?: IGetBaseVo[];
  subscription?: ISubscriptionSummaryVo;
}
export const SpaceCard: FC<ISpaceCard> = (props) => {
  const { space, bases } = props;

  const { t } = useTranslation(spaceConfig.i18nNamespaces);

  return (
    <Card className="w-full">
      <CardHeader className="pt-5">
        <div className="flex w-full items-center justify-between gap-3">
          <div className="group flex flex-1 items-center gap-2 overflow-hidden">
            <CardTitle className="truncate leading-5" title={space.name}>
              {space.name}
            </CardTitle>

            {space?.organization && (
              <div className="text-sm text-gray-500">{space.organization.name}</div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {bases?.length ? (
          <DraggableBaseGrid bases={bases} />
        ) : (
          <div className="flex h-24 w-full items-center justify-center">
            {t('space:spaceIsEmpty')}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
