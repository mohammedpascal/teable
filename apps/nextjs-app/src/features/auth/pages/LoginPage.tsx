import { Link, useNavigate, useRouterState, useSearch } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';
import Tea from '@/components/Tea';
import { useEnv } from '@/features/app/hooks/useEnv';
import { useInitializationZodI18n } from '@/features/app/hooks/useInitializationZodI18n';
import { authConfig } from '@/features/i18n/auth.config';
import { ScrollArea, Tabs, TabsList, TabsTrigger } from '@/ui-lib/shadcn';
import { DescContent } from '../components/DescContent';
import { SignForm } from '../components/SignForm';
import { SocialAuth } from '../components/SocialAuth';

export const LoginPage = (props: { children?: React.ReactNode | React.ReactNode[] }) => {
  const { children } = props;
  useInitializationZodI18n();
  const { t } = useTranslation(authConfig.i18nNamespaces);
  const routerState = useRouterState();
  const navigate = useNavigate();
  const search = useSearch({ strict: false });
  const redirect = decodeURIComponent((search.redirect as string) || '');
  const signType = routerState.location.pathname.endsWith('/signup') ? 'signup' : 'signin';
  const { passwordLoginDisabled } = useEnv();

  const onSuccess = useCallback(() => {
    if (redirect && redirect.startsWith('/')) {
      navigate({ to: redirect });
    } else {
      navigate({ to: '/' });
    }
  }, [redirect, navigate]);

  return (
    <ScrollArea className="h-screen">
      <div className="flex min-h-screen">
        <div className="fixed left-5 top-5 flex flex-none items-center gap-2">
          <Tea />
          {t('common:brand')}
        </div>
        <DescContent />
        <div className="relative flex flex-1 shrink-0 flex-col items-center justify-center">
          <div className="absolute right-0 top-0 flex h-[4em] items-center justify-end bg-background px-5 lg:h-20">
            <Tabs value={signType}>
              <TabsList>
                <Link to="/auth/login" search={search}>
                  <TabsTrigger value="signin">{t('auth:button.signin')}</TabsTrigger>
                </Link>
                <Link to="/auth/signup" search={search}>
                  <TabsTrigger value="signup">{t('auth:button.signup')}</TabsTrigger>
                </Link>
              </TabsList>
            </Tabs>
          </div>
          <div className="relative w-80 py-[5em] lg:py-24">
            {!passwordLoginDisabled && <SignForm type={signType} onSuccess={onSuccess} />}
            <SocialAuth />
            {children}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};
