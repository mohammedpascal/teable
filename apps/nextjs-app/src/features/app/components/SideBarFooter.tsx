import { useSession } from '@teable/sdk';
import { Button } from '@teable/ui-lib/shadcn';
import React from 'react';
import { NotificationsManage } from '@/features/app/components/notifications/NotificationsManage';
import { UserAvatar } from '@/features/app/components/user/UserAvatar';
import { SettingDialog } from './setting/SettingDialog';
import { UserNav } from './user/UserNav';

export const SideBarFooter: React.FC = () => {
  const { user } = useSession();

  return (
    <div className="m-2 flex flex-col items-center gap-1">
      <div className="mb-1 flex w-full justify-between">
        <UserNav>
          <Button variant="ghost" size={'xs'} className="w-full justify-start text-sm font-normal">
            <UserAvatar user={user} />
            {user.name}
          </Button>
        </UserNav>
        <SettingDialog />
        <NotificationsManage />
      </div>
    </div>
  );
};
