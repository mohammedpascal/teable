import enSDkJson from '@teable/common-i18n/src/locales/en/sdk.json';
import enZodJson from '@teable/common-i18n/src/locales/en/zod.json';
import zhSDkJson from '@teable/common-i18n/src/locales/zh/sdk.json';
import zhZodJson from '@teable/common-i18n/src/locales/zh/zod.json';
import type { Metadata } from 'next';
import { EnvProvider } from '../../../features/app/components/plugin-shared/EnvProvider';
import { I18nProvider } from '../../../features/app/components/plugin-shared/I18nProvider';
import QueryClientProvider from '../../../features/app/components/plugin-shared/QueryClientProvider';
import { PageType } from '../../../features/app/components/plugin-shared/types';
import enCommonJson from '../../../../public/locales/sheet-form-view/en.json';
import zhCommonJson from '../../../../public/locales/sheet-form-view/zh.json';
import { Pages } from './components/Pages';
import icon from './favicon.ico';

type Props = {
  searchParams: { lang: string };
};

const resources = {
  en: { sdk: enSDkJson, common: enCommonJson, zod: enZodJson },
  zh: { sdk: zhSDkJson, common: zhCommonJson, zod: zhZodJson },
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  // read route params
  const lang = searchParams.lang;

  return {
    title: lang === 'zh' ? '表格表单' : 'Sheet Form',
    icons: icon.src,
  };
}

export default async function Home(props: {
  searchParams: {
    lang: string;
    baseId: string;
    pluginInstallId: string;
    dashboardId: string;
    pluginId: string;
    theme: string;
    shareId?: string;
  };
}) {
  return (
    <main className="flex h-screen flex-col items-center justify-center">
      <EnvProvider>
        <I18nProvider
          lang={props.searchParams.lang}
          resources={resources}
          defaultNS="common"
          pageType={PageType.View}
        >
          <QueryClientProvider>
            <Pages {...props.searchParams} />
          </QueryClientProvider>
        </I18nProvider>
      </EnvProvider>
    </main>
  );
}
