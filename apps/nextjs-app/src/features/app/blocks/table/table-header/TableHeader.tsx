import { HelpCircle, MoreHorizontal, Puzzle, Settings, UserPlus } from '@teable/icons';
import { useBase, useTableId, useView } from '@teable/sdk/hooks';
import {
  Button,
  cn,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ScrollArea,
  ScrollBar,
} from '@teable/ui-lib/shadcn';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { Fragment } from 'react';
import { BaseCollaboratorModalTrigger } from '@/features/app/components/collaborator-manage/base/BaseCollaboratorModal';
import { tableConfig } from '@/features/i18n/table.config';
import { usePluginPanelStorage } from '../../../components/plugin-panel/hooks/usePluginPanelStorage';
import { ExpandViewList } from '../../view/list/ExpandViewList';
import { ViewList } from '../../view/list/ViewList';

import { useLockedViewTipStore } from '../store';
import { AddView } from './AddView';
import { Collaborators } from './Collaborators';
import { LockedViewTip } from './LockedViewTip';
import { TableInfo } from './TableInfo';

const RightList = ({
  className,
  buttonClassName,
}: {
  className?: string;
  buttonClassName?: string;
}) => {
  const base = useBase();
  const tableId = useTableId();
  const { t } = useTranslation(tableConfig.i18nNamespaces);
  const { toggleVisible } = usePluginPanelStorage(tableId!);

  return (
    <div className={cn('flex', className)}>
      <Collaborators className="flex" />
      <div className="flex">
        <Button asChild variant="ghost" size="xs" className={cn('flex', buttonClassName)}>
          <Link
            href={{
              pathname: '/base/[baseId]/design',
              query: { baseId: base.id, tableId },
            }}
            title={t('table:table.design')}
          >
            <Settings className="size-4" />
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="xs"
          className={cn('flex', buttonClassName)}
          onClick={toggleVisible}
        >
          <Puzzle className="size-4" />
        </Button>
        <Button asChild variant="ghost" size="xs" className={cn('flex', buttonClassName)}>
          <a href={t('help.mainLink')} title={t('help.title')} target="_blank" rel="noreferrer">
            <HelpCircle className="size-4" />
          </a>
        </Button>
      </div>
      <BaseCollaboratorModalTrigger
        base={{
          name: base.name,
          role: base.role,
          id: base.id,
        }}
      >
        <Button variant="default" size="xs" className="flex">
          <UserPlus className="size-4" />{' '}
          <span className="hidden @md/view-header:inline">{t('space:action.invite')}</span>
        </Button>
      </BaseCollaboratorModalTrigger>
    </div>
  );
};

const RightMenu = ({ className }: { className?: string }) => {
  const base = useBase();
  const tableId = useTableId();
  const { t } = useTranslation(tableConfig.i18nNamespaces);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'ghost'}
          size={'xs'}
          className={cn('font-normal shrink-0 truncate', className)}
        >
          <MoreHorizontal className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent side="bottom" align="start" className="w-32 p-0">
        <div className="flex flex-col">
          <Collaborators className="flex p-2" />
          <BaseCollaboratorModalTrigger
            base={{
              name: base.name,
              role: base.role,
              id: base.id,
            }}
          >
            <Button variant="ghost" size="xs" className="flex justify-start">
              <UserPlus className="size-4" /> {t('space:action.invite')}
            </Button>
          </BaseCollaboratorModalTrigger>

          <Button asChild variant="ghost" size="xs" className="flex justify-start">
            <Link
              href={{
                pathname: '/base/[baseId]/design',
                query: { baseId: base.id, tableId },
              }}
              title={t('table:table.design')}
            >
              <Settings className="size-4" /> {t('table:table.design')}
            </Link>
          </Button>
          <Button asChild variant="ghost" size="xs" className="flex justify-start">
            <a href={t('help.mainLink')} title={t('help.title')} target="_blank" rel="noreferrer">
              <HelpCircle className="size-4" /> {t('help.title')}
            </a>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export const TableHeader: React.FC = () => {
  const view = useView();
  const { visible } = useLockedViewTipStore();
  const tipVisible = view?.isLocked && visible;

  return (
    <Fragment>
      <div
        className={cn(
          'flex h-[42px] shrink-0 flex-row items-center gap-2 px-4 @container/view-header',
          tipVisible && 'border-b'
        )}
      >
        <TableInfo className="shrink-0 grow-0" />
        <ExpandViewList />
        <ScrollArea className="h-[42px]">
          <div className="flex h-[42px] items-center gap-2">
            <ViewList />
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <AddView />
        <div className="grow basis-0"></div>
        <RightList className="hidden gap-2 @md/view-header:flex" />
        <RightMenu className="flex @md/view-header:hidden" />
      </div>
      {tipVisible && <LockedViewTip />}
    </Fragment>
  );
};
