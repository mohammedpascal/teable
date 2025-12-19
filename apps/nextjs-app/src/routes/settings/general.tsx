import { createFileRoute } from '@tanstack/react-router';
import type { ISettingPageProps } from '@/features/app/blocks/admin';
import { SettingPage } from '@/features/app/blocks/admin';
import { SettingLayout } from '@/features/app/layouts/SettingLayout';

export const Route = createFileRoute('/settings/general')({
  component: GeneralSettingsPageComponent,
});

function GeneralSettingsPageComponent() {
  // TODO: Load server data via loader
  const settingServerData: ISettingPageProps['settingServerData'] = undefined;

  return (
    <SettingLayout>
      <SettingPage settingServerData={settingServerData} />
    </SettingLayout>
  );
}

