import { useTranslation } from 'next-i18next';
import { useRef, type FC } from 'react';
import { spaceConfig } from '@/features/i18n/space.config';
import { useSetting } from '../../hooks/useSetting';
import { SpaceCard } from './SpaceCard';
import { useBaseList } from './useBaseList';
import { useSpaceListOrdered } from './useSpaceListOrdered';

export const SpacePage: FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useTranslation(spaceConfig.i18nNamespaces);

  const orderedSpaceList = useSpaceListOrdered();

  const baseList = useBaseList();

  const { disallowSpaceInvitation } = useSetting();

  return (
    <div ref={ref} className="flex h-screen flex-1 flex-col overflow-hidden py-8">
      <div className="flex items-center justify-between px-12">
        <h1 className="text-2xl font-semibold">{t('space:allSpaces')}</h1>
      </div>
      <div className="flex-1 space-y-8 overflow-y-auto px-8 pt-8 sm:px-12">
        {orderedSpaceList.map((space) => (
          <SpaceCard
            key={space.id}
            space={space}
            bases={baseList?.filter(({ spaceId }) => spaceId === space.id)}
            disallowSpaceInvitation={disallowSpaceInvitation}
          />
        ))}
      </div>
    </div>
  );
};
