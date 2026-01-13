import { Hydrate, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@teable/next-themes';
import isObject from 'lodash/isObject';
import merge from 'lodash/merge';
import { useMemo, useState } from 'react';
import { AppContext } from '../app/AppContext';
import { ConnectionProvider } from './ConnectionProvider';
import type { ILocalePartial } from './i18n';
import { defaultLocale } from './i18n';
import { createQueryClient } from './queryClient';

interface IAppProviderProps {
  forcedTheme?: string;
  children: React.ReactNode;
  wsPath?: string;
  lang?: string;
  locale?: ILocalePartial;
  dehydratedState?: unknown;
  disabledWs?: boolean;
}

export const AppProvider = (props: IAppProviderProps) => {
  const { forcedTheme, children, wsPath, lang, locale, dehydratedState, disabledWs } = props;
  const [queryClient] = useState(() => createQueryClient());
  const value = useMemo(() => {
    return {
      lang,
      locale: isObject(locale) ? merge(defaultLocale, locale) : defaultLocale,
    };
  }, [lang, locale]);

  const themeProviderProps = {
    attribute: 'class' as const,
    forcedTheme,
    enableSystem: true,
    disableTransitionOnChange: true,
    storageKey: 'theme',
  };

  if (disabledWs) {
    return (
      <ThemeProvider {...themeProviderProps}>
        <AppContext.Provider value={value}>
          <QueryClientProvider client={queryClient}>
            <Hydrate state={dehydratedState}>{children}</Hydrate>
          </QueryClientProvider>
        </AppContext.Provider>
      </ThemeProvider>
    );
  }

  // forcedTheme is not work as expected https://github.com/pacocoursey/next-themes/issues/252
  return (
    <ThemeProvider {...themeProviderProps}>
      <AppContext.Provider value={value}>
        <ConnectionProvider wsPath={wsPath}>
          <QueryClientProvider client={queryClient}>
            <Hydrate state={dehydratedState}>{children}</Hydrate>
          </QueryClientProvider>
        </ConnectionProvider>
      </AppContext.Provider>
    </ThemeProvider>
  );
};
