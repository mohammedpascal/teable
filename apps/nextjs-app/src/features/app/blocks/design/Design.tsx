import { AnchorContext } from '@teable/sdk/context';
import { Separator } from '@teable/ui-lib/shadcn';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { SettingsHeader } from '../setting/SettingsHeader';
import { IntegrityButton } from './components/Integrity';
import { TablePicker, TableTabs } from './TableTabs';

export const Design = () => {
  const router = useRouter();
  const tableId = router.query.tableId as string;
  const { t } = useTranslation(['table', 'common']);

  return (
    <AnchorContext.Provider value={{ tableId }}>
      <div className="h-screen w-full overflow-y-auto bg-background">
        {/* Header */}

        <SettingsHeader title={t('table:table.design', { defaultValue: 'Design' })}>
          <>
            <TablePicker
              tableId={tableId}
              readonly={false}
              onChange={(tableId) =>
                router.push({ pathname: '/settings/design', query: { tableId } })
              }
            />
            <span className="grow" />
            <div className="ml-auto">
              <IntegrityButton />
            </div>
          </>
        </SettingsHeader>

        <Separator />
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <TableTabs />
        </div>
      </div>
    </AnchorContext.Provider>
  );
};
