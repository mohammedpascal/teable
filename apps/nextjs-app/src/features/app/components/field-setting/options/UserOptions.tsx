import type { CellValueType, IUserCellValue, IUserFieldOptions } from '@teable/core';
import { UserEditor } from '@/sdk/components';
import { Label, Switch } from '@/ui-lib';
import keyBy from 'lodash/keyBy';
import { useTranslation } from 'react-i18next';
import { tableConfig } from '@/features/i18n/table.config';
import { DefaultValue } from '../DefaultValue';

export const UserOptions = (props: {
  options: Partial<IUserFieldOptions> | undefined;
  isLookup?: boolean;
  cellValueType?: CellValueType;
  onChange?: (options: Partial<IUserFieldOptions>) => void;
}) => {
  const { options = {}, isLookup, onChange } = props;
  const { isMultiple, shouldNotify } = options;
  const { t } = useTranslation(tableConfig.i18nNamespaces);

  // Collaboration removed - user list not available
  const collaborators: undefined = undefined;

  const onIsMultipleChange = (checked: boolean) => {
    onChange?.({
      isMultiple: checked,
    });
  };

  const onShouldNotifyChange = (checked: boolean) => {
    onChange?.({
      shouldNotify: checked,
    });
  };

  const onDefaultValueChange = (defaultValue: IUserCellValue | IUserCellValue[] | undefined) => {
    onChange?.({
      defaultValue: Array.isArray(defaultValue) ? defaultValue.map((v) => v.id) : defaultValue?.id,
    });
  };

  const defaultValueToUser = (
    options: IUserFieldOptions
  ): IUserCellValue | IUserCellValue[] | undefined => {
    if (!options.defaultValue || !collaborators) return undefined;
    const transformedCollaborators = collaborators.map((collaborator) => ({
      userName: collaborator.userName || '',
      userId: collaborator.userId || '',
      email: collaborator.email || '',
      avatar: collaborator.avatar,
    }));
    const userMap = keyBy<{
      userName: string;
      userId: string;
      email: string;
      avatar?: string | null;
    }>(transformedCollaborators, 'userId');
    userMap['me'] = {
      userName: t('sdk:filter.currentUser'),
      userId: 'me',
      email: '',
    };
    const { defaultValue, isMultiple } = options;
    const values = [defaultValue].flat();
    if (isMultiple) {
      return values
        .filter((id) => userMap[id])
        .map((id) => ({
          title: userMap[id].userName,
          id: userMap[id].userId,
          email: userMap[id].email,
          avatarUrl: userMap[id].avatar,
        }));
    }

    const user = userMap[values[0]];
    if (!user) return undefined;
    return {
      title: user.userName,
      id: user.userId,
      email: user.email,
      avatarUrl: user.avatar,
    };
  };

  return (
    <div className="form-control space-y-2">
      {!isLookup && (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Switch
              id="field-options-is-multiple"
              checked={Boolean(isMultiple)}
              onCheckedChange={onIsMultipleChange}
            />
            <Label htmlFor="field-options-is-multiple" className="font-normal">
              {t('table:field.editor.allowMultiUsers')}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="field-options-should-notify"
              checked={Boolean(shouldNotify)}
              onCheckedChange={onShouldNotifyChange}
            />
            <Label htmlFor="field-options-should-notify" className="font-normal">
              {t('table:field.editor.notifyUsers')}
            </Label>
          </div>
          <DefaultValue onReset={() => onDefaultValueChange(undefined)}>
            <UserEditor
              value={defaultValueToUser(options)}
              onChange={onDefaultValueChange}
              options={options}
              includeMe
            />
          </DefaultValue>
        </div>
      )}
    </div>
  );
};
