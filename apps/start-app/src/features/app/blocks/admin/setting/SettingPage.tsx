import {
  Button,
  Input,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Separator,
  Switch,
} from '@/ui-lib/shadcn';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ISettingVo, IUpdateSettingRo } from '@teable/openapi';
import { getSetting, updateSetting } from '@teable/openapi';
import { Pencil } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SettingsHeader } from '../../setting/SettingsHeader';

interface InstanceNameFieldProps {
  label: string;
  value: string | null | undefined;
  onSave: (value: string | null) => Promise<void>;
}

const InstanceNameField = ({ label, value, onSave }: InstanceNameFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation('common');

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleOpenChange = (open: boolean) => {
    setIsEditing(open);
    if (open) {
      setEditValue(value);
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      await onSave(editValue || null);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <Label>{label}</Label>
      </div>
      <div className="flex items-center gap-2 pt-2">
        <div className="text-[13px] text-gray-500">{value}</div>
        <Popover open={isEditing} onOpenChange={handleOpenChange}>
          <PopoverTrigger asChild>
            <Pencil className="size-4 cursor-pointer text-muted-foreground hover:text-foreground" />
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <form
              className="space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                await handleSave();
              }}
            >
              <div className="space-y-2">
                <Label>{label}</Label>
                <Input
                  value={editValue || ''}
                  onChange={(e) => setEditValue(e.target.value)}
                  data-1p-ignore="true"
                  autoComplete="off"
                  placeholder={label}
                  autoFocus
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsEditing(false);
                    setEditValue(value);
                  }}
                  disabled={isLoading}
                >
                  {t('actions.cancel')}
                </Button>
                <Button type="submit" size="sm" disabled={isLoading}>
                  {t('actions.submit')}
                </Button>
              </div>
            </form>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export interface ISettingPageProps {
  settingServerData?: ISettingVo;
}

export const SettingPage = (props: ISettingPageProps) => {
  const { settingServerData } = props;
  const queryClient = useQueryClient();
  const { t } = useTranslation('common');

  const { data: setting = settingServerData } = useQuery({
    queryKey: ['setting'],
    queryFn: () => getSetting().then(({ data }) => data),
  });

  const { mutateAsync: mutateUpdateSetting } = useMutation({
    mutationFn: (props: IUpdateSettingRo) => updateSetting(props),
    onSuccess: () => {
      queryClient.invalidateQueries(['setting']);
    },
  });

  const onValueChange = (key: string, value: unknown) => {
    mutateUpdateSetting({ [key]: value });
  };

  const handleUpdateInstanceName = async (newName: string | null) => {
    await mutateUpdateSetting({ instanceName: newName });
  };

  if (!setting) return null;

  const { instanceName, disallowSignUp, enableEmailVerification } = setting;

  return (
    <div className="flex h-screen w-full flex-col overflow-y-auto overflow-x-hidden">
      <SettingsHeader title={t('settings.general', { defaultValue: 'General' })} />
      <Separator />
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {/* General Settings Section */}
        <div className="border-b py-4">
          <div className="flex w-full flex-col space-y-4">
            <div className="flex flex-col space-y-2 rounded-lg border p-4 shadow-sm">
              <InstanceNameField
                label={t('admin.setting.name', { defaultValue: 'Name' })}
                value={instanceName}
                onSave={handleUpdateInstanceName}
              />
            </div>
            <div className="flex items-center justify-between space-x-2 rounded-lg border p-4 shadow-sm">
              <div className="space-y-1">
                <Label htmlFor="allow-sign-up">{t('admin.setting.allowSignUp')}</Label>
                <div className="text-[13px] text-gray-500">
                  {t('admin.setting.allowSignUpDescription')}
                </div>
              </div>
              <Switch
                id="allow-sign-up"
                checked={!disallowSignUp}
                onCheckedChange={(checked) => onValueChange('disallowSignUp', !checked)}
              />
            </div>
            <div className="flex items-center justify-between space-x-2 rounded-lg border p-4 shadow-sm">
              <div className="space-y-1">
                <Label htmlFor="enable-email-verification">
                  {t('admin.setting.enableEmailVerification')}
                </Label>
                <div className="text-[13px] text-gray-500">
                  {t('admin.setting.enableEmailVerificationDescription')}
                </div>
              </div>
              <Switch
                id="enable-email-verification"
                checked={!enableEmailVerification}
                onCheckedChange={(checked) => onValueChange('enableEmailVerification', !checked)}
              />
            </div>
          </div>
        </div>

        <p className="p-4 text-right text-xs">
          {t('settings.setting.version')}: {import.meta.env.VITE_BUILD_VERSION ?? process.env.NEXT_PUBLIC_BUILD_VERSION}
        </p>
      </div>
    </div>
  );
};
