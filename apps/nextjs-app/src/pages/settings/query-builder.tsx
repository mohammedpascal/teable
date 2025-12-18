import type { ReactElement } from 'react';
import React from 'react';
import { QueryBuilder } from '@/features/app/blocks/setting/query-builder/QueryBuilder';
import { SettingLayout } from '@/features/app/layouts/SettingLayout';
import type { NextPageWithLayout } from '@/lib/type';

const QueryBuilderPage: NextPageWithLayout = () => {
  return <QueryBuilder />;
};

QueryBuilderPage.getLayout = function getLayout(page: ReactElement, pageProps) {
  return <SettingLayout {...pageProps}>{page}</SettingLayout>;
};

export default QueryBuilderPage;
