import { useMutation } from '@tanstack/react-query';
import { updateUserAvatar, updateUserName } from '@teable/openapi';
import { useIsTouchDevice, useSession } from '@/sdk';
import {
  Button,
  Input,
  Label,
  Separator,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Badge,
} from '@/ui-lib/shadcn';
import { useTranslation } from 'next-i18next';
import React from 'react';
import { UserAvatar } from '@/features/app/components/user/UserAvatar';
import { AddPassword } from './account/AddPassword';
import { ChangeEmailDialog } from './account/ChangeEmailDialog';
import { ChangePasswordDialog } from './account/ChangePasswordDialog';

const PERMISSION_GROUPS = [
  {
    label: 'Records',
    permissions: ['record|create', 'record|delete', 'record|update'] as const,
  },
  {
    label: 'Views',
    permissions: ['view|create', 'view|delete', 'view|update'] as const,
  },
  {
    label: 'Tables',
    permissions: [
      'table|read',
      'table|manage',
      'table|import',
      'table|export',
    ] as const,
  },
] as const;

const PERMISSION_LABELS: Record<string, string> = {
  'record|create': 'Create record',
  'record|delete': 'Delete record',
  'record|update': 'Update record',
  'view|create': 'Create view',
  'view|delete': 'Delete view',
  'view|update': 'Update view',
  'table|read': 'Read table',
  'table|manage': 'Manage table',
  'table|import': 'Import data into table',
  'table|export': 'Export table data',
};

export const Account: React.FC = () => {
  const { user: sessionUser, refresh, refreshAvatar } = useSession();
  const { t } = useTranslation('common');
  const isTouchDevice = useIsTouchDevice();

  const updateUserAvatarMutation = useMutation(updateUserAvatar, {
    onSuccess: () => {
      refreshAvatar?.();
    },
  });

  const updateUserNameMutation = useMutation(updateUserName, {
    onSuccess: () => {
      refresh?.();
    },
  });

  const toggleRenameUser = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    const name = e.target.value;
    if (name && name !== sessionUser.name) {
      updateUserNameMutation.mutate({ name });
    }
  };

  const uploadAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const avatarFille = e.target.files?.[0];
    if (!avatarFille) {
      return;
    }
    const formData = new FormData();
    formData.append('file', avatarFille);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateUserAvatarMutation.mutate(formData as any);
  };

  const avatarComponent = (
    <div className="group relative flex h-fit items-center justify-center">
      <UserAvatar className="size-14" width={80} height={80} user={sessionUser} />
      <div className="absolute left-0 top-0 size-full rounded-full bg-transparent group-hover:bg-muted-foreground/20">
        <input
          type="file"
          className="absolute inset-0 size-full opacity-0"
          accept="image/*"
          onChange={uploadAvatar}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6 pb-16">
      <h3 className="text-lg font-medium">{t('settings.account.title')}</h3>
      <Separator />
      <div className="flex">
        {isTouchDevice ? (
          avatarComponent
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>{avatarComponent}</TooltipTrigger>
              <TooltipContent>
                <p>{t('settings.account.updatePhoto')}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        <div className="ml-4 flex-1 pt-3">
          <Input
            className="w-full"
            defaultValue={sessionUser.name}
            onBlur={(e) => toggleRenameUser(e)}
          />
          <Label className="text-xs text-muted-foreground" htmlFor="Preferred name">
            {t('settings.account.updateNameDesc')}
          </Label>
        </div>
      </div>
      <div>
        <h3 className="text-base font-medium">
          {t('settings.account.securityTitle')}
          {!sessionUser.hasPassword && <AddPassword />}
        </h3>
        <Separator className="my-2" />
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>{t('settings.account.email')}</Label>
              <div className="text-xs text-muted-foreground">{sessionUser.email}</div>
            </div>
            <ChangeEmailDialog>
              <Button className="float-right" size={'sm'} variant={'outline'}>
                {t('settings.account.changeEmail.title')}
              </Button>
            </ChangeEmailDialog>
          </div>
          {sessionUser.hasPassword && (
            <div className="flex items-center justify-between">
              <div>
                <Label>{t('settings.account.password')}</Label>
                <div className="text-xs text-muted-foreground">
                  {t('settings.account.passwordDesc')}
                </div>
              </div>
              <ChangePasswordDialog>
                <Button className="float-right" size={'sm'} variant={'outline'}>
                  {t('settings.account.changePassword.title')}
                </Button>
              </ChangePasswordDialog>
            </div>
          )}
        </div>
      </div>
      <div>
        <h3 className="text-base font-medium">
          {t('settings.account.permissionsTitle', { defaultValue: 'Permissions' })}
        </h3>
        <Separator className="my-2" />
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">
              {t('settings.account.role', { defaultValue: 'Role' })}
            </Label>
            <div className="mt-1">
              {sessionUser.isAdmin ? (
                <Badge variant="default" className="bg-primary/10 text-primary">
                  {t('setting:users.admin', { defaultValue: 'Admin' })}
                </Badge>
              ) : sessionUser.role ? (
                <Badge variant="secondary">{sessionUser.role.name}</Badge>
              ) : (
                <span className="text-sm text-muted-foreground">
                  {t('setting:users.noRole', { defaultValue: 'No role' })}
                </span>
              )}
            </div>
          </div>
          {sessionUser.isAdmin ? (
            <div>
              <Label className="text-sm font-medium">
                {t('settings.account.permissions', { defaultValue: 'Permissions' })}
              </Label>
              <div className="mt-2 text-sm text-muted-foreground">
                {t('settings.account.allPermissions', { defaultValue: 'All permissions' })}
              </div>
            </div>
          ) : sessionUser.role && sessionUser.role.permissions ? (
            <div>
              <Label className="text-sm font-medium">
                {t('settings.account.permissions', { defaultValue: 'Permissions' })}
              </Label>
              <div className="mt-2 space-y-4">
                {PERMISSION_GROUPS.map((group) => {
                  const groupPermissions = sessionUser.role!.permissions.filter((perm) =>
                    group.permissions.includes(perm as any)
                  );
                  if (groupPermissions.length === 0) return null;

                  return (
                    <div key={group.label} className="space-y-2">
                      <h4 className="text-sm font-medium">{group.label}</h4>
                      <div className="flex flex-wrap gap-3">
                        {groupPermissions.map((permission) => (
                          <div key={permission} className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">✓</span>
                            <span className="text-sm">
                              {PERMISSION_LABELS[permission] || permission}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div>
              <Label className="text-sm font-medium">
                {t('settings.account.permissions', { defaultValue: 'Permissions' })}
              </Label>
              <div className="mt-2 text-sm text-muted-foreground">
                {t('settings.account.noPermissions', { defaultValue: 'No permissions' })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
