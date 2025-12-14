import { Sidebar } from '@teable/icons';
import { AnchorContext } from '@teable/sdk/context';
import { Button, TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@teable/ui-lib/shadcn';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useSidebar } from '../../contexts/SidebarContext';
import { IntegrityButton } from './components/Integrity';
import { TablePicker, TableTabs } from './TableTabs';

export const Design = () => {
  const router = useRouter();
  const tableId = router.query.tableId as string;
  const { t } = useTranslation(['table', 'common']);
  const { toggleSidebar } = useSidebar();

  return (
    <AnchorContext.Provider value={{ tableId }}>
      <div className="h-screen overflow-y-auto bg-background">
        {/* Header */}
        <div className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center gap-2 px-4 py-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="xs"
                    className="h-8 w-8 shrink-0 p-0"
                    onClick={toggleSidebar}
                  >
                    <Sidebar className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent hideWhenDetached={true}>
                  <p>{t('common:actions.collapseSidebar')} ⌘+B</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <h1 className="text-lg font-semibold">{t('table:table.design')}</h1>
            <TablePicker
              tableId={tableId}
              readonly={false}
              onChange={(tableId) => router.push({ pathname: '/settings/design', query: { tableId } })}
            />
            <div className="ml-auto">
              <IntegrityButton />
            </div>
          </div>
        </div>

        <div className="space-y-4 p-4 pb-8">
          <TableTabs />
        </div>
      </div>
    </AnchorContext.Provider>
  );
};
