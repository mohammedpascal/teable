import { ArrowLeft, Sidebar } from '@teable/icons';
import {
  Button,
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@teable/ui-lib/shadcn';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { useSidebar } from '../../contexts/SidebarContext';

interface ISettingRightTitle {
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  onBack?: () => void;
}
export const SettingRightTitle = (props: ISettingRightTitle) => {
  const { title, description, onBack } = props;
  const { toggleSidebar } = useSidebar();
  const { t } = useTranslation('common');

  return (
    <div className="flex h-16 flex-1 items-center gap-x-4">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="xs"
              className="size-8 shrink-0 p-0"
              onClick={toggleSidebar}
            >
              <Sidebar className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent hideWhenDetached={true}>
            <p>{t('actions.collapseSidebar')} ⌘+B</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {onBack && (
        <Button className="px-0 text-base" variant={'link'} onClick={onBack}>
          <ArrowLeft />
        </Button>
      )}
      <Head>
        <title>{title}</title>
      </Head>
      <div className="flex flex-1 flex-col justify-center">
        <h2 className="text-base">{title}</h2>
      </div>
    </div>
  );
};
