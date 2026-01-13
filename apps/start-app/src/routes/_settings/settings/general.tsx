import { createFileRoute } from '@tanstack/react-router';
import { SettingPage } from '@/features/app/blocks/admin';
import { useSetting } from '@/hooks/api/useSetting';

export const Route = createFileRoute('/_settings/settings/general')({
  path: '/settings/general',
  component: GeneralSettingsPageComponent,
});

function GeneralSettingsPageComponent() {
  const { data: settingServerData } = useSetting();

  return <SettingPage settingServerData={settingServerData} />;
}

