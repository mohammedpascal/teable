import { Sidebar } from '@/components/icons';
import { useSidebar } from '@/features/app/contexts/SidebarContext';
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/ui-lib/shadcn';
import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/_base/')({
  path: '/',
  component: IndexComponent,
});

function IndexComponent() {
  const { t } = useTranslation(['table', 'common']);
  const { toggleSidebar } = useSidebar();

  return (
    <div className="h-full flex-col md:flex">
      <div className="flex h-full flex-1 flex-col gap-2 lg:gap-4">
        <div className="flex h-14 items-center gap-x-4 px-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={toggleSidebar}
                  className="size-8 shrink-0 p-0"
                >
                  <Sidebar className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent hideWhenDetached={true}>
                <p>{t('common:actions.collapseSidebar')} ⌘+B</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <h2 className="break-words text-base">{t('table:welcome.title')}</h2>
        </div>
        <div className="flex h-full flex-col items-center justify-center p-4">
          <ul className="mb-4 space-y-2 text-left">
            <li>{t('table:welcome.description')}</li>
            
          </ul>
        </div>
      </div>
    </div>
  );
}

