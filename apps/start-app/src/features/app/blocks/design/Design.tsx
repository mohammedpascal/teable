import { useNavigate, useSearch } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { AnchorContext } from '@/sdk/context';
import { Separator } from '@/ui-lib/shadcn';
import { SettingsHeader } from '../setting/SettingsHeader';
import { IntegrityButton } from './components/Integrity';
import { TablePicker, TableTabs } from './TableTabs';

export const Design = () => {
  const navigate = useNavigate();
  const search = useSearch({ strict: false });
  const tableId = (search.tableId as string) || '';
  const { t } = useTranslation(['table', 'common']);

  return (
    <AnchorContext.Provider value={{ tableId }}>
      <div className="bg-background h-screen w-full overflow-y-auto">
        {/* Header */}

        <SettingsHeader title={t('table:table.design', { defaultValue: 'Design' })}>
          <>
            <TablePicker
              tableId={tableId}
              readonly={false}
              onChange={(tableId) =>
                navigate({ to: '/settings/design', search: { tableId } })
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
