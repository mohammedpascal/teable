import { useTranslation } from 'next-i18next';
import { SettingRight } from './SettingRight';
import { SettingRightTitle } from './SettingRightTitle';

export const BaseSettingsPage = () => {
  const { t } = useTranslation('common');

  return (
    <SettingRight title={<SettingRightTitle title={t('settings.title')} />}>
      <div className="my-3 space-y-1">
        <div className="border-b pb-4">
          <h1 className="text-2xl font-semibold">{t('settings.title')}</h1>
          <div className="mt-3 text-sm text-slate-500">
            {t('settings.title')} {/* TODO: Add base-specific settings content */}
          </div>
        </div>
      </div>
    </SettingRight>
  );
};

