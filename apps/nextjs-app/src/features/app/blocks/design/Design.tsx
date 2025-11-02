import { AnchorContext, TablePermissionProvider } from '@teable/sdk/context';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { IntegrityButton } from './components/Integrity';
import { TableTabs, TablePicker } from './TableTabs';

export const Design = () => {
  const router = useRouter();
  const baseId = router.query.baseId as string;
  const tableId = router.query.tableId as string;
  const { t } = useTranslation(['table']);

  return (
    <AnchorContext.Provider value={{ baseId }}>
      <TablePermissionProvider baseId={baseId}>
        <div className="h-screen overflow-y-auto bg-background">
          {/* Header */}
          <div className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center gap-2 px-4 py-1">
              <h1 className="text-lg font-semibold">{t('table:table.design')}</h1>
              {tableId && (
                <TablePicker
                  tableId={tableId}
                  readonly={false}
                  onChange={(tableId) =>
                    router.push({ pathname: router.pathname, query: { ...router.query, tableId } })
                  }
                />
              )}
              <div className="ml-auto">
                <IntegrityButton />
              </div>
            </div>
          </div>

          <div className="space-y-4 p-4 pb-8">
            <TableTabs />
          </div>
        </div>
      </TablePermissionProvider>
    </AnchorContext.Provider>
  );
};
