import { createFileRoute } from '@tanstack/react-router';
import type { ISettingPageProps } from '@/features/app/blocks/admin';
import { SettingPage } from '@/features/app/blocks/admin';
import { SettingLayout } from '@/features/app/layouts/SettingLayout';
import { getSettingServerData } from '@/server/setting';

export const Route = createFileRoute('/settings/general')({
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
    <SettingLayout>
      <SettingPage settingServerData={settingServerData} />
    </SettingLayout>
  );
}

