import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { Trans, useTranslation } from 'react-i18next';
import { BaseLayout } from '@/features/app/layouts/BaseLayout';

export const getServerTime = createServerFn({ method: 'GET' }).handler(async () => {
  return { time: new Date().toISOString() };
});

export const Route = createFileRoute('/')({
  loader: async () => {
    const { time } = await getServerTime();
    console.log('time2', time);
    return { time };
  },
  component: IndexComponent,
});

function IndexComponent() {
  const { time } = Route.useLoaderData();
  const { t } = useTranslation(['table', 'common']);
  return (
    <BaseLayout>
      <div className="h-full flex-col md:flex">
        <div className="flex h-full flex-1 flex-col gap-2 lg:gap-4">
          <div className="items-center justify-between space-y-2 px-8 pb-2 pt-6 lg:flex">
            <h2 className="text-3xl font-bold tracking-tight">{t('table:welcome.title')}</h2>
          </div>
          <div className="flex h-full flex-col items-center justify-center p-4">
            <ul className="mb-4 space-y-2 text-left">
              <li>{t('table:welcome.description')}</li>
              <li>{time && <div>{time}</div>}</li>
              <li>
                <Trans
                  ns="table"
                  i18nKey="welcome.help"
                  components={{
                    HelpCenter: (
                      <a
                        href={'https://help.teable.io'}
                        className="text-blue-500 hover:text-blue-700"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {t('table:welcome.helpCenter')}
                      </a>
                    ),
                  }}
                ></Trans>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
