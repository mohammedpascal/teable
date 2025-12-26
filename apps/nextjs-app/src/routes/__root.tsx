import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import * as Sentry from '@sentry/react';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { createRootRoute, Outlet, Scripts, ScrollRestoration, createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';
import { z } from 'zod';
import { Guide } from '@/components/Guide';
import { MicrosoftClarity, Umami } from '@/components/Metrics';
import RouterProgressBar from '@/components/RouterProgress';
import { useLoadAllTranslations } from '@/features/app/hooks/useLoadAllTranslations';
import type { IServerEnv } from '@/lib/server-env';
import '@/lib/i18n/config';
import type { IUser } from '@/sdk';
import { colors } from '@/themes/colors';
import { getColorsCssVariablesText } from '@/themes/utils';
import { AppProviders } from '../AppProviders';
import '@glideapps/glide-data-grid/dist/index.css';
import '../styles/global.css';
import '@fontsource-variable/inter';

import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

dayjs.extend(utc);
dayjs.extend(timezone);
extendZodWithOpenApi(z);

// TODO: Get user and env from route context/loader once implemented
const RootComponent = () => {
  // Load all translations on app start (client-side)
  useLoadAllTranslations();

  // TODO: Get user from route context
  const user: IUser | undefined = undefined;
  const env: IServerEnv = {};

  useEffect(() => {
    if (user) {
      Sentry.setUser({ id: user.id, email: user.email });
    }
  }, [user]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width,viewport-fit=cover, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/images/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/images/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/images/favicon/favicon-16x16.png"
        />
        <link rel="manifest" href="/images/favicon/site.webmanifest" />
        <link rel="mask-icon" href="/images/favicon/safari-pinned-tab.svg" color="#5bbad5" />
        <link rel="shortcut icon" href="/images/favicon/favicon.svg" type="image/svg+xml" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="msapplication-config" content="/images/favicon/browserconfig.xml" />
        <meta name="theme-color" content="#ffffff" />
        <style>{getColorsCssVariablesText(colors)}</style>
      </head>
      <body>
        <AppProviders env={env}>
          <MicrosoftClarity clarityId={env.microsoftClarityId} user={user} />
          <Umami umamiWebSiteId={env.umamiWebSiteId} umamiUrl={env.umamiUrl} user={user} />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.version="${import.meta.env.VITE_BUILD_VERSION ?? (import.meta.env.DEV ? 'develop' : 'production')}";
                window.__TE__=${JSON.stringify(env)};
              `,
            }}
          />
          <Outlet />
          {user && <Guide user={user} />}
          <RouterProgressBar />
        </AppProviders>
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
};

export const Route = createRootRoute({
  component: RootComponent,
});

