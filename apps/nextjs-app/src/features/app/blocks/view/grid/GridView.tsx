import { AggregationProvider, RecordProvider, RowCountProvider } from '@teable/sdk/context';
import { SearchProvider } from '@teable/sdk/context/query';
import { GridToolBar } from '../tool-bar/GridToolBar';
import type { IViewBaseProps } from '../types';
import { GridViewBase } from './GridViewBase';

export const GridView = (props: IViewBaseProps) => {
  const { recordServerData, recordsServerData, groupPointsServerDataMap } = props;

  return (
    <SearchProvider>
      <RecordProvider serverRecords={recordsServerData.records} serverRecord={recordServerData}>
        <AggregationProvider>
          <RowCountProvider>
            <GridToolBar />
            <div className="w-full grow overflow-hidden sm:pl-2">
              <GridViewBase groupPointsServerDataMap={groupPointsServerDataMap} />
            </div>
          </RowCountProvider>
        </AggregationProvider>
      </RecordProvider>
    </SearchProvider>
  );
};
