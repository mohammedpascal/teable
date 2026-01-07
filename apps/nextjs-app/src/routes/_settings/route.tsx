import { createFileRoute } from '@tanstack/react-router';
import { SettingLayout } from '@/features/app/layouts/SettingLayout';

export const Route = createFileRoute('/_settings')({
  component: SettingLayoutComponent,
});

function SettingLayoutComponent() {
  return <SettingLayout />;
}

