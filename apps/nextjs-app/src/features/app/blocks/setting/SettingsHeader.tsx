import { Sidebar } from '@/components/icons';
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/ui-lib/shadcn';
import { useTranslation } from 'next-i18next';
import React from 'react';
import { useSidebar } from '../../contexts/SidebarContext';

interface ISettingsHeader {
  title: string | React.ReactNode;
  children?: React.ReactNode;
}

export const SettingsHeader = (props: ISettingsHeader) => {
  const { title, children } = props;
  const { toggleSidebar } = useSidebar();
  const { t } = useTranslation('common');

  return (
    <div className="flex h-14 items-center gap-x-4 px-4">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="xs"
              variant="ghost"
              onClick={toggleSidebar}
              className="size-8 shrink-0 p-0"
            >
              <Sidebar className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent hideWhenDetached={true}>
            <p>{t('actions.collapseSidebar')} ⌘+B</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <h2 className="break-words text-base">{title}</h2>
      {children}
    </div>
  );
};
