import { hasPermission } from '@teable/core';
import { MoreHorizontal, UserPlus } from '@teable/icons';
import type { IGetSpaceVo } from '@teable/openapi';
import type { ButtonProps } from '@teable/ui-lib';
import { Button } from '@teable/ui-lib';
import { useTranslation } from 'next-i18next';
import React from 'react';
import { GUIDE_CREATE_BASE } from '@/components/Guide';
import { spaceConfig } from '@/features/i18n/space.config';
import { SpaceActionTrigger } from '../../blocks/space/component/SpaceActionTrigger';
import { SpaceCollaboratorModalTrigger } from '../collaborator-manage/space/SpaceCollaboratorModalTrigger';
import { CreateBaseModalTrigger } from './CreateBaseModal';

interface ActionBarProps {
  space: IGetSpaceVo;
  invQueryFilters: string[];
  className?: string;
  buttonSize?: ButtonProps['size'];
  disallowSpaceInvitation?: boolean | null;
  onRename?: () => void;
  onSpaceSetting?: () => void;
}

export const SpaceActionBar: React.FC<ActionBarProps> = (props) => {
  const {
    space,
    className,
    buttonSize = 'default',
    disallowSpaceInvitation,
    onRename,
    onSpaceSetting,
  } = props;
  const { t } = useTranslation(spaceConfig.i18nNamespaces);

  return (
    <div className={className}>
      {!disallowSpaceInvitation && (
        <SpaceCollaboratorModalTrigger space={space}>
          <Button variant={'outline'} size={buttonSize}>
            <UserPlus className="size-4" /> {t('space:action.invite')}
          </Button>
        </SpaceCollaboratorModalTrigger>
      )}

      <SpaceActionTrigger
        space={space}
        showRename={hasPermission(space.role, 'space|update')}
        showSpaceSetting={hasPermission(space.role, 'space|update')}
        onRename={onRename}
        onSpaceSetting={onSpaceSetting}
      >
        <Button variant={'outline'} size={buttonSize}>
          <MoreHorizontal />
        </Button>
      </SpaceActionTrigger>
    </div>
  );
};
