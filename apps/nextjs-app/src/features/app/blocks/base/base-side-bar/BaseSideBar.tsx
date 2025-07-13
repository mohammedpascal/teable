import { Gauge, Settings } from '@teable/icons';
import { useBasePermission } from '@teable/sdk/hooks';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  cn,
} from '@teable/ui-lib/shadcn';
import { Button } from '@teable/ui-lib/shadcn/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useMemo } from 'react';
import { tableConfig } from '@/features/i18n/table.config';
import { TableList } from '../../table-list/TableList';
import { QuickAction } from './QuickAction';

export const BaseSideBar = () => {
  const router = useRouter();
  const { baseId } = router.query;
  const { t } = useTranslation(tableConfig.i18nNamespaces);

  const basePermission = useBasePermission();

  const pageRoutes: {
    href: string;
    label: string;
    Icon: React.FC<{ className?: string }>;
    disabled?: boolean;
  }[] = useMemo(
    () =>
      [
        {
          href: `/base/${baseId}/dashboard`,
          label: t('common:noun.dashboard'),
          Icon: Gauge,
          hidden: !basePermission?.['base|read'],
        },

        {
          href: `/base/${baseId}/design`,
          label: t('table:table.design'),
          Icon: Settings,
        },
      ].filter((item) => !item.hidden),
    [baseId, basePermission, t]
  );

  return (
    <>
      <div className="flex flex-col gap-2 px-3">
        <div>
          <QuickAction>{t('common:quickAction.title')}</QuickAction>
        </div>
        <ul>
          {pageRoutes.map(({ href, label, Icon, disabled }) => {
            return (
              <li key={href}>
                {disabled ? (
                  <TooltipProvider delayDuration={200}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          className="my-[2px] w-full cursor-not-allowed justify-start text-sm font-normal text-gray-500 hover:bg-background hover:text-gray-500"
                          variant="ghost"
                          size="xs"
                          asChild
                          disabled
                        >
                          <div className="flex">
                            <Icon className="size-4 shrink-0" />
                            <p className="truncate">{label}</p>
                            <div className="grow basis-0"></div>
                          </div>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t('billing.unavailableInPlanTips')}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <Button
                    variant="ghost"
                    size="xs"
                    asChild
                    className={cn(
                      'w-full justify-start text-sm my-[2px]',
                      router.asPath.startsWith(href) && 'bg-secondary'
                    )}
                  >
                    <Link href={href} className="font-normal">
                      <Icon className="size-4 shrink-0" />
                      <p className="truncate">{label}</p>
                      <div className="grow basis-0"></div>
                    </Link>
                  </Button>
                )}
              </li>
            );
          })}
        </ul>
      </div>
      <TableList />
    </>
  );
};
