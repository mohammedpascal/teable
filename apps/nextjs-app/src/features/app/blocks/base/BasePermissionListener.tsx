import { baseConfig } from '@/features/i18n/base.config';
import { usePermissionUpdateListener } from '@teable/sdk/hooks';
import { AlertDialog, AlertDialogContent, Button } from '@teable/ui-lib/shadcn';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';

export const BasePermissionListener = () => {
  const router = useRouter();
  const { t } = useTranslation(baseConfig.i18nNamespaces);
  const [open, setOpen] = useState(false);

  const onPermissionUpdate = useCallback(async () => {
    setOpen(true);
  }, []);

  usePermissionUpdateListener(onPermissionUpdate);

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <div className="text-sm">{t('common:pagePermissionChangeTip')}</div>
        <div className="text-right">
          <Button className="h-7" size={'sm'} onClick={() => router.reload()}>
            {t('common:actions.refreshPage')}
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
