import { useQuery } from '@tanstack/react-query';
import type { IUserCellValue } from '@teable/core';
import { FieldType } from '@teable/core';
import { getUserList } from '@teable/openapi';
import type { ForwardRefRenderFunction } from 'react';
import React, { forwardRef, useMemo } from 'react';
import { useTranslation } from '../../../context/app/i18n';
import { useSession } from '../../../hooks/use-session';
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
  const { user: currentUser } = useSession();
  const { data, isLoading } = useQuery({
    queryKey: ['user-list'],
    queryFn: () => getUserList().then((res) => res.data),
  });

  const collaborators = useMemo(() => {
    const users = data?.users || [];
    let transformedUsers = users.map((user) => ({
      userId: user.id,
      userName: user.name,
      email: user.email,
      avatar: user.avatar ?? null,
    }));

    // Add "me" option if includeMe is true and currentUser exists
    if (props.includeMe && currentUser) {
      // Remove current user from the list if they're already there
      transformedUsers = transformedUsers.filter((user) => user.userId !== currentUser.id);
      // Add "me" option at the beginning
      transformedUsers.unshift({
        userId: currentUser.id,
        userName: t('filter.currentUser'),
        email: currentUser.email || '',
        avatar: currentUser.avatar ?? null,
      });
    }

    return transformedUsers.filter(
      (c) => c.userId && c.userName && c.email
    ) as CollaboratorWithRequiredFields[];
  }, [data, props.includeMe, currentUser, t]);

  return (
    <UserEditorBase {...props} collaborators={collaborators} isLoading={isLoading} ref={ref} />
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
