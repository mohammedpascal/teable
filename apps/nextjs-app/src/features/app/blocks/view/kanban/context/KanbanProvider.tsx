import type { IUserCellValue } from '@teable/core';
import { FieldType } from '@teable/core';
import type { UserCollaboratorItem } from '@teable/openapi';
import { GroupPointType } from '@teable/openapi';
import { ExpandRecorder } from '@teable/sdk/components';
// import { ShareViewContext } from '@teable/sdk/context';
import {
  useFieldPermission,
  useFields,
  useGroupPoint,
  useTableId,
  useTablePermission,
  useView
} from '@teable/sdk/hooks';
import type { AttachmentField, IFieldInstance, KanbanView } from '@teable/sdk/model';
import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { UNCATEGORIZED_STACK_ID } from '../constant';
import { KanbanContext } from './KanbanContext';

const UNCATEGORIZED_STACK_DATA = {
  id: UNCATEGORIZED_STACK_ID,
  count: 0,
  data: null,
};

export const KanbanProvider = ({ children }: { children: ReactNode }) => {
  const tableId = useTableId();
  const view = useView() as KanbanView | undefined;
  // const { shareId } = useContext(ShareViewContext) ?? {};
  const shareId = undefined; // Temporarily disabled
  const { sort, filter } = view ?? {};
  const permission = useTablePermission();
  const fields = useFields();
  const allFields = useFields({ withHidden: true, withDenied: true });
  const { stackFieldId, coverFieldId, isCoverFit, isFieldNameHidden, isEmptyStackHidden } =
    view?.options ?? {};
  const [expandRecordId, setExpandRecordId] = useState<string>();
  const groupPoints = useGroupPoint();

  const recordQuery = useMemo(() => {
    const baseQuery = {
      orderBy: sort?.sortObjs,
      filter: filter,
    };

    if (shareId) return baseQuery;

    return baseQuery;
  }, [shareId, sort, filter]);

  const stackField = useMemo(() => {
    if (!stackFieldId) return;
    return allFields.find(({ id }) => id === stackFieldId);
  }, [stackFieldId, allFields]);

  const { type, isMultipleCellValue } = stackField ?? {};

  // const { data: shareViewCollaborators } = useQuery({
  //   queryKey: ReactQueryKeys.shareViewCollaborators(shareId, {
  //     type: PrincipalType.User,
  //     skip: 0,
  //     take: 5000,
  //   }),
  //   queryFn: ({ queryKey }) =>
  //     getShareViewCollaborators(queryKey[1], queryKey[2] as IShareViewCollaboratorsRo).then(
  //       (data) => data.data
  //     ),
  //   enabled: Boolean(shareId && type === FieldType.User && !isMultipleCellValue),
  // });

  // Collaboration removed - user list not available
  const userList: UserCollaboratorItem[] = [];

  const kanbanPermission = useMemo(() => {
    const canUpdateField = Boolean(permission['table|update'] || permission['table|create']);
    return {
      stackCreatable: canUpdateField,
      stackEditable: canUpdateField,
      stackDeletable: canUpdateField,
      stackDraggable: canUpdateField,
      cardCreatable: Boolean(permission['record|create']),
      cardEditable: Boolean(permission['record|update']),
      cardDeletable: Boolean(permission['record|delete']),
      cardDraggable: Boolean(permission['record|update'] && permission['view|update']),
    };
  }, [permission]);

  const stackCollection = useMemo(() => {
    if (groupPoints == null || stackField == null) return;

    const { type, options, isMultipleCellValue } = stackField;
    const isDisabledStackField = type === FieldType.Attachment;

    if (isDisabledStackField) return;

    const stackList: { id: string; count: number; data: unknown }[] = [];
    const stackMap: Record<string, { id: string; count: number; data: unknown }> = {};

    groupPoints.forEach((cur, index) => {
      if (cur.type !== GroupPointType.Header) return;

      const { id: groupId, value } = cur;
      const rowData = groupPoints[index + 1];

      if (rowData?.type !== GroupPointType.Row) return;
      if (value == null) return;

      const { count } = rowData;
      const obj = {
        id: groupId,
        count,
        data: value,
      };
      stackList.push(obj);

      if (type === FieldType.SingleSelect) {
        stackMap[value as string] = obj;
      }

      if (type === FieldType.User && !isMultipleCellValue) {
        stackMap[(value as IUserCellValue).id] = obj;
      }
    });

    if (type === FieldType.SingleSelect) {
      const choices = options?.choices;
      const stackList = choices.map(
        ({ id, name }) =>
          stackMap[name] ?? {
            id,
            count: 0,
            data: name,
          }
      );
      stackList.unshift(UNCATEGORIZED_STACK_DATA);
      if (isEmptyStackHidden) {
        return stackList.filter(({ count }) => count > 0);
      }

      return stackList;
    }

    if (type === FieldType.User && !isMultipleCellValue && userList) {
      const stackList = userList.map(
        ({ id, name, email, avatar }) =>
          stackMap[id] ?? {
            id: id,
            count: 0,
            data: {
              id: id,
              title: name,
              email,
              avatarUrl: avatar,
            },
          }
      );
      stackList.unshift(UNCATEGORIZED_STACK_DATA);
      if (isEmptyStackHidden) {
        return stackList.filter(({ count }) => count > 0);
      }

      return stackList;
    }

    stackList.unshift(UNCATEGORIZED_STACK_DATA);
    if (isEmptyStackHidden) {
      return stackList.filter(({ count }) => count > 0);
    }

    return stackList;
  }, [groupPoints, isEmptyStackHidden, stackField, userList]);

  const coverField = useMemo(() => {
    if (!coverFieldId) return;
    return allFields.find(
      ({ id, type }) => id === coverFieldId && type === FieldType.Attachment
    ) as AttachmentField | undefined;
  }, [coverFieldId, allFields]);

  const { primaryField, displayFields } = useMemo(() => {
    let primaryField: IFieldInstance | null = null;
    const displayFields = fields.filter((f) => {
      if (f.isPrimary) {
        primaryField = f;
        return false;
      }
      return true;
    });

    return {
      primaryField: primaryField as unknown as IFieldInstance,
      displayFields,
    };
  }, [fields]);

  const value = useMemo(() => {
    return {
      recordQuery,
      isCoverFit,
      isFieldNameHidden,
      isEmptyStackHidden,
      permission: kanbanPermission,
      stackField,
      coverField,
      primaryField,
      displayFields,
      stackCollection,
      setExpandRecordId,
    };
  }, [
    recordQuery,
    isCoverFit,
    isFieldNameHidden,
    isEmptyStackHidden,
    kanbanPermission,
    stackField,
    coverField,
    primaryField,
    displayFields,
    stackCollection,
    setExpandRecordId,
  ]);

  return (
    <KanbanContext.Provider value={value}>
      {children}
      {tableId && (
        <ExpandRecorder
          tableId={tableId}
          viewId={view?.id}
          recordId={expandRecordId}
          recordIds={expandRecordId ? [expandRecordId] : []}
          onClose={() => setExpandRecordId(undefined)}
        />
      )}
    </KanbanContext.Provider>
  );
};
