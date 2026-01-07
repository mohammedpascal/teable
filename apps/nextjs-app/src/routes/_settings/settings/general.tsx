import { createFileRoute } from '@tanstack/react-router';
import { SettingPage } from '@/features/app/blocks/admin';
import { getSettingServerData } from '@/server/setting';

export const Route = createFileRoute('/_settings/settings/general')({
  path: '/settings/general',
  loader: async () => {
    try {
      const settingServerData= await getSettingServerData() 
      console.log('settingServerData', settingServerData);
      return { settingServerData };
    } catch (error) {
      console.error('Failed to load setting data:', error);
      // Return undefined to allow the component to handle the error gracefully
      return { settingServerData: undefined };
    }
  },
  component: GeneralSettingsPageComponent,
});

function GeneralSettingsPageComponent() {
  const { settingServerData } = Route.useLoaderData();

  return (
    <SettingPage settingServerData={settingServerData} />
  );
}

