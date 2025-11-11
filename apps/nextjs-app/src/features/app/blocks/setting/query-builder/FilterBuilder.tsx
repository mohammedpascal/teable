import type { IFilterSet } from '@teable/core';
import { BaseViewFilter, useViewFilterLinkContext } from '@teable/sdk';
import { useFields, useTableId, useViewId } from '@teable/sdk/hooks';
import { useHookPermission } from '@teable/sdk/hooks/use-hook-permission';

export const FilterBuilder = ({
  filter,
  onChange,
}: {
  filter: IFilterSet | null;
  onChange: (filter: IFilterSet | null) => void;
}) => {
  const fields = useFields({ withHidden: true, withDenied: true });

  const viewId = useViewId();
  const tableId = useTableId();
  const permission = useHookPermission();
  const viewFilterLinkContext = useViewFilterLinkContext(tableId, viewId, {
    disabled: !permission['view|update'],
  });

  return (
    <BaseViewFilter
      value={filter}
      onChange={onChange}
      fields={fields}
      viewFilterLinkContext={viewFilterLinkContext}
    />
  );
};
