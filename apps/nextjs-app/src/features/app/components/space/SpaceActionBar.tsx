import { Settings, UserPlus } from '@teable/icons';
import type { IGetSpaceVo } from '@teable/openapi';
import type { ButtonProps } from '@teable/ui-lib';
import { Button } from '@teable/ui-lib';
import { useTranslation } from 'next-i18next';
import React from 'react';
import { spaceConfig } from '@/features/i18n/space.config';
import { SpaceCollaboratorModalTrigger } from '../collaborator-manage/space/SpaceCollaboratorModalTrigger';
interface ActionBarProps {
  space: IGetSpaceVo;
  invQueryFilters: string[];
  className?: string;
  buttonSize?: ButtonProps['size'];
  disallowSpaceInvitation?: boolean | null;
  onSpaceSetting?: () => void;
}

export const SpaceActionBar: React.FC<ActionBarProps> = (props) => {
  const {
    space,
    className,
    buttonSize = 'default',
    disallowSpaceInvitation,
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

      <Button variant={'outline'} size={buttonSize} onClick={onSpaceSetting}>
        <Settings className="size-4" /> {t('space:spaceSetting.title')}
      </Button>
    </div>
  );
};
