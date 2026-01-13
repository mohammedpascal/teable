import { AggregationProvider, RecordProvider, RowCountProvider } from '@/sdk/context';
import { SearchProvider } from '@/sdk/context/query';
import { useRecords } from '@/sdk/hooks/use-records';
import { GridToolBar } from '../tool-bar/GridToolBar';
import type { IViewBaseProps } from '../types';
import { GridViewBase } from './GridViewBase';

export const GridView = (props: IViewBaseProps) => {
  const { recordServerData, recordsServerData, groupPointsServerDataMap } = props;
  
  // Use client-side hook as fallback when server data is not available
  const { records: clientRecords } = useRecords(undefined, recordsServerData?.records);
  
  // Use server data if available, otherwise use client-fetched records
  const records = recordsServerData?.records ?? clientRecords;

  return (
    <SearchProvider>
      <RecordProvider serverRecords={records} serverRecord={recordServerData}>
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
