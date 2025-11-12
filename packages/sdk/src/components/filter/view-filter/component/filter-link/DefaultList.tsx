import { RowCountProvider } from '../../../../../context';
import { LinkFilterProvider } from '../../../../../context/query/LinkFilterProvider';
import { SocketRecordList } from '../../../../record-list';
import { StorageLinkSelected } from './storage';
import type { IFilterLinkSelectListProps } from './types';

export const DefaultList = (props: IFilterLinkSelectListProps) => {
  const { field, value, onClick } = props;

  const isSingle = typeof value === 'string';
  const values = isSingle ? [value] : value;

  return (
    <LinkFilterProvider filterLinkCellSelected={field.id}>
      <RowCountProvider>
        <SocketRecordList
          selectedRecordIds={values || undefined}
          onClick={(value) => {
            onClick(value.id);
            StorageLinkSelected.set(`${field.options.foreignTableId}-${value.id}`, value.title);
          }}
          primaryFieldId={field.options.lookupFieldId}
        />
      </RowCountProvider>
    </LinkFilterProvider>
  );
};
