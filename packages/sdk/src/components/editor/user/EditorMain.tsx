import type { IUserCellValue } from '@teable/core';
import { FieldType } from '@teable/core';
import type { ForwardRefRenderFunction } from 'react';
import React, { forwardRef } from 'react';
import { useTranslation } from '../../../context/app/i18n';
import type { ICellEditor, ICellEditorContext } from '../type';

type CollaboratorWithRequiredFields = {
  userId: string;
  userName: string;
  email: string;
  avatar?: string | null;
};
import type { IUserEditorRef } from './EditorBase';
import { UserEditorBase } from './EditorBase';

export interface IUserEditorMainProps extends ICellEditor<IUserCellValue | IUserCellValue[]> {
  isMultiple?: boolean;
  includeMe?: boolean;
  onChange?: (value?: IUserCellValue | IUserCellValue[]) => void;
  onSearch?: (value: string) => void;
  style?: React.CSSProperties;
  className?: string;
}

const DefaultDataWrapper = forwardRef<IUserEditorRef, IUserEditorMainProps>((props, ref) => {
  const { t } = useTranslation();
  // Collaboration feature removed - returns minimal user list (only "me" if includeMe is true)
  const collaborators = props.includeMe
    ? [{ userId: 'me', userName: t('filter.currentUser'), email: '' }]
    : [];

  return (
    <UserEditorBase
      {...props}
      collaborators={
        (collaborators || []).filter(
          (c) => c.userId && c.userName && c.email
        ) as CollaboratorWithRequiredFields[]
      }
      isLoading={false}
      ref={ref}
    />
  );
});

DefaultDataWrapper.displayName = 'UserDefaultDataWrapper';

const ContextDataWrapper = forwardRef<
  IUserEditorRef,
  IUserEditorMainProps & {
    contextData: ICellEditorContext[FieldType.User];
  }
>((props, ref) => {
  const { isLoading, data, onSearch } = props.contextData;
  return (
    <UserEditorBase
      {...props}
      collaborators={data}
      isLoading={isLoading}
      ref={ref}
      onSearch={onSearch}
    />
  );
});

ContextDataWrapper.displayName = 'UserContextDataWrapper';

const UserEditorMainBase: ForwardRefRenderFunction<IUserEditorRef, IUserEditorMainProps> = (
  props,
  ref
) => {
  const contextData = props.context?.[FieldType.User];

  if (contextData) {
    return <ContextDataWrapper {...props} contextData={contextData} ref={ref} />;
  }
  return <DefaultDataWrapper {...props} ref={ref} />;
};

export const UserEditorMain = forwardRef(UserEditorMainBase);
