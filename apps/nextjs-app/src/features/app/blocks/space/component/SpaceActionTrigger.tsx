import { Pencil, Settings } from '@teable/icons';
import type { IGetSpaceVo } from '@teable/openapi';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@teable/ui-lib/shadcn';
import { useTranslation } from 'next-i18next';
import React from 'react';
import { spaceConfig } from '@/features/i18n/space.config';

interface ISpaceActionTrigger {
  space: IGetSpaceVo;
  showRename?: boolean;
  showDelete?: boolean;
  showSpaceSetting?: boolean;
  onRename?: () => void;
  onSpaceSetting?: () => void;
  open?: boolean;
  setOpen?: (open: boolean) => void;
}

export const SpaceActionTrigger: React.FC<React.PropsWithChildren<ISpaceActionTrigger>> = (
  props
) => {
  const { children, showRename, showSpaceSetting, onRename, onSpaceSetting, open, setOpen } = props;
  const { t } = useTranslation(spaceConfig.i18nNamespaces);
  if (!showRename) {
    return null;
  }
  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {showRename && (
            <DropdownMenuItem onClick={onRename}>
              <Pencil className="mr-2" />
              {t('actions.rename')}
            </DropdownMenuItem>
          )}
          {showSpaceSetting && (
            <DropdownMenuItem onClick={onSpaceSetting}>
              <Settings className="mr-2" />
              {t('space:spaceSetting.title')}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
