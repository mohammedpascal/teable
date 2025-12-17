import { GUIDE_API_BUTTON } from '@/components/Guide';
import { Code2, Database, MoreHorizontal } from '@/components/icons';
import { useTableId } from '@/sdk/hooks';
import { Button, cn, Popover, PopoverContent, PopoverTrigger } from '@/ui-lib/shadcn';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { SearchButton } from '../search/SearchButton';
import { ToolBarButton } from './ToolBarButton';

const OthersList = ({
  classNames,
  className,
}: {
  classNames?: { textClassName?: string; buttonClassName?: string };
  className?: string;
}) => {
  const { t } = useTranslation('table');
  const tableId = useTableId();

  const { textClassName, buttonClassName } = classNames ?? {};

  return (
    <div className={cn('gap-1', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <ToolBarButton
            text="API"
            className={cn(GUIDE_API_BUTTON, buttonClassName)}
            textClassName={textClassName}
          >
            <Code2 className="size-4" />
          </ToolBarButton>
        </PopoverTrigger>
        <PopoverContent side="bottom" align="start" className="w-48 p-0">
          <Button
            variant={'ghost'}
            size={'xs'}
            className="w-full justify-start font-normal"
            asChild
          >
            <Link
              href={{
                pathname: '/settings/query-builder',
                query: { tableId },
              }}
              target="_blank"
            >
              <Code2 className="size-4" />
              {t('toolbar.others.api.restfulApi')}
            </Link>
          </Button>
          <Button
            variant={'ghost'}
            size={'xs'}
            className="w-full justify-start font-normal"
            asChild
          >
            <Link
              href={{
                pathname: '/settings/design',
                query: { tableId },
              }}
            >
              <Database className="pr-1 text-lg" />
              {t('toolbar.others.api.databaseConnection')}
            </Link>
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
};

const OthersMenu = ({ className }: { className?: string }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'ghost'}
          size={'xs'}
          className={cn('font-normal shrink-0 truncate', className)}
        >
          <MoreHorizontal className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent side="bottom" align="start" className="w-40 p-0">
        <OthersList
          className="flex flex-col"
          classNames={{ textClassName: 'inline', buttonClassName: 'justify-start rounded-none' }}
        />
      </PopoverContent>
    </Popover>
  );
};

export const Others: React.FC = () => {
  return (
    <div className="flex flex-1 justify-end @container/toolbar-others md:gap-1">
      <SearchButton />
      <OthersList
        className="hidden @md/toolbar:flex"
        classNames={{ textClassName: '@[300px]/toolbar-others:inline' }}
      />
      <OthersMenu className="@md/toolbar:hidden" />
    </div>
  );
};
