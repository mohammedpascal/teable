import { useSession } from '@/sdk';
import { Button } from '@teable/ui-lib/shadcn';
import React from 'react';
import { NotificationsManage } from '@/features/app/components/notifications/NotificationsManage';
import { UserAvatar } from '@/features/app/components/user/UserAvatar';
import { useSidebar } from '@/features/app/contexts/SidebarContext';
import { SettingDialog } from './setting/SettingDialog';
import { UserNav } from './user/UserNav';

export const SideBarFooter: React.FC = () => {
  const { user } = useSession();
  const { leftVisible } = useSidebar();
  const isCollapsed = leftVisible === 'collapsed';

  return (
    <div className="m-2 flex flex-col items-center gap-1">
      {isCollapsed ? (
        <div className="mb-1 flex w-full flex-col items-center gap-1">
          <div className="mb-1">
            <NotificationsManage />
          </div>
          <UserNav>
            <Button
              variant="ghost"
              size={'xs'}
              className="w-auto justify-center p-2 text-sm font-normal"
            >
              <UserAvatar user={user} />
            </Button>
          </UserNav>
          <SettingDialog />
        </div>
      ) : (
        <div className="mb-1 flex w-full justify-between">
          <UserNav>
            <Button
              variant="ghost"
              size={'xs'}
              className="w-full justify-start text-sm font-normal"
            >
              <UserAvatar user={user} />
              {user.name}
            </Button>
          </UserNav>
          <SettingDialog />
          <NotificationsManage />
        </div>
      )}
    </div>
  );
};
