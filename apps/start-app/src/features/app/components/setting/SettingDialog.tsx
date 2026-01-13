import { Bell, Settings, UserEdit } from '@/components/icons';
import { useIsTouchDevice } from '@/sdk/hooks';
import {
  Dialog,
  DialogContent,
  Sheet,
  SheetContent,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/ui-lib/shadcn';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { System } from '@/features/app/components/setting/System';
import { Account } from './Account';
import { Notifications } from './Notifications';
import { useSettingStore } from './useSettingStore';

export const SettingDialog = () => {
  const { t } = useTranslation('common');
  const isTouchDevice = useIsTouchDevice();
  const { open, setOpen } = useSettingStore();

  const tabList = useMemo(() => {
    return [
      {
        key: 'profile',
        name: t('settings.account.tab'),
        Icon: UserEdit,
      },
      {
        key: 'system',
        name: t('settings.setting.title'),
        Icon: Settings,
      },
      {
        key: 'notifications',
        name: t('settings.notify.title'),
        Icon: Bell,
      },
    ];
  }, [t]);

  const content = (
    <Tabs defaultValue="profile" className="flex h-full gap-4 overflow-hidden">
      <TabsList className="grid gap-2 bg-inherit text-left">
        {tabList.map(({ key, name, Icon }) => {
          return (
            <TabsTrigger
              key={key}
              value={key}
              className="justify-start gap-2 font-normal data-[state=active]:bg-muted data-[state=active]:font-medium"
            >
              <Icon className="size-5 shrink-0 sm:size-4" />
              <span className="hidden sm:inline">{name}</span>
            </TabsTrigger>
          );
        })}
      </TabsList>
      <TabsContent
        tabIndex={-1}
        value="profile"
        className="mt-0 size-full overflow-y-auto overflow-x-hidden"
      >
        <Account />
      </TabsContent>
      <TabsContent
        tabIndex={-1}
        value="system"
        className="mt-0 size-full overflow-y-auto overflow-x-hidden"
      >
        <System />
      </TabsContent>
      <TabsContent
        tabIndex={-1}
        value="notifications"
        className="mt-0 size-full overflow-y-auto overflow-x-hidden"
      >
        <Notifications />
      </TabsContent>
    </Tabs>
  );

  return (
    <>
      {isTouchDevice ? (
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent className="h-5/6 rounded-t-lg px-1 pb-0 pt-4" side="bottom">
            {content}
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="h-5/6 max-h-[800px] max-w-6xl pb-0">{content}</DialogContent>
        </Dialog>
      )}
    </>
  );
};
