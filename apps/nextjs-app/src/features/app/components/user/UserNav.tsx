import { ExitIcon } from '@radix-ui/react-icons';
import { useMutation } from '@tanstack/react-query';
import { Settings, User } from '@teable/icons';
import { signout } from '@teable/openapi';
import { useSession } from '@teable/sdk/hooks';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@teable/ui-lib/shadcn';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import React from 'react';
import { useSettingStore } from '../setting/useSettingStore';

export const UserNav: React.FC<React.PropsWithChildren> = (props) => {
  const { children } = props;
  const router = useRouter();
  const { t } = useTranslation(['common']);
  const { user } = useSession();
  const setting = useSettingStore();
  const { mutateAsync: loginOut, isLoading } = useMutation({
    mutationFn: signout,
  });

  const loginOutClick = async () => {
    await loginOut();
    router.push('/auth/login');
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-56" align="end" forceMount>
        <DropdownMenuItem className="flex cursor-pointer gap-2 font-normal">
          <Avatar className="size-7 shrink-0">
            <AvatarImage src={user.avatar ?? ''} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <DropdownMenuItem className="flex gap-2" onClick={() => router.push('/settings/general')}>
          <Settings className="size-4 shrink-0" />
          Admin Settings
        </DropdownMenuItem>

        <DropdownMenuItem
          className="flex gap-2"
          onClick={() => setting.setOpen(true)}
          disabled={isLoading}
        >
          <User className="size-4 shrink-0" />

          {t('settings.account.title')}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="flex gap-2" onClick={loginOutClick} disabled={isLoading}>
          <ExitIcon className="size-4 shrink-0" />
          {t('settings.nav.logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
