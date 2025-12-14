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
import { useSidebar } from '../../contexts/SidebarContext';

export interface ISidebarContentRoute {
  Icon: React.FC<{ className?: string }>;
  label: string | React.ReactNode;
  route: string;
  pathTo: string;
  disabledTip?: string;
}

interface ISidebarContentProps {
  className?: string;
  title?: string;
  routes: ISidebarContentRoute[];
}

export const SidebarContent = (props: ISidebarContentProps) => {
  const { title, routes, className } = props;
  const router = useRouter();
  const { leftVisible } = useSidebar();
  const isCollapsed = leftVisible === 'collapsed';

  return (
    <div
      className={cn('flex flex-col gap-2 border-t py-2', isCollapsed ? 'px-2' : 'px-4', className)}
    >
      {title && !isCollapsed && <span className="text-sm text-slate-500">{title}</span>}
      <ul>
        {routes.map(({ Icon, label, route, pathTo, disabledTip }) => {
          const isActive = route === router.pathname;

          if (disabledTip) {
            return (
              <li key={route}>
                <TooltipProvider delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className={cn(
                          'my-[2px] w-full cursor-not-allowed text-sm font-normal text-gray-500 hover:bg-background hover:text-gray-500',
                          isCollapsed ? 'justify-center p-2' : 'justify-start'
                        )}
                        variant="ghost"
                        size="xs"
                        asChild
                        disabled
                      >
                        <div className={cn('flex', isCollapsed && 'justify-center')}>
                          <Icon className="size-4 shrink-0" />
                          {!isCollapsed && (
                            <>
                              <p className="truncate">{label}</p>
                              <div className="grow basis-0"></div>
                            </>
                          )}
                        </div>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{disabledTip}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </li>
            );
          }

          const buttonContent = (
            <div className={cn('flex items-center', isCollapsed && 'justify-center')}>
              <Icon className="size-4 shrink-0" />
              {!isCollapsed && (
                <>
                  <p className="ml-2 truncate">{label}</p>
                  <div className="grow basis-0"></div>
                </>
              )}
            </div>
          );

          return (
            <li key={route}>
              {isCollapsed ? (
                <TooltipProvider delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="xs"
                        asChild
                        className={cn(
                          'w-full text-sm my-[2px] justify-center p-2',
                          isActive && 'bg-secondary'
                        )}
                      >
                        <Link href={pathTo} className="font-normal">
                          {buttonContent}
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{label}</p>
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
                    isActive && 'bg-secondary'
                  )}
                >
                  <Link href={pathTo} className="font-normal">
                    {buttonContent}
                  </Link>
                </Button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
