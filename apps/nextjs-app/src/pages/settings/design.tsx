import type { ITableVo } from '@teable/openapi';
import type { ReactElement } from 'react';
import { Design } from '@/features/app/blocks/design/Design';
import { SettingLayout } from '@/features/app/layouts/SettingLayout';
import type { NextPageWithLayout } from '@/lib/type';
import { TableProvider } from '@/sdk/context';

interface IDesignPageProps {
  tableServerData?: ITableVo[];
}

const DesignPage: NextPageWithLayout<IDesignPageProps> = ({ tableServerData }) => {
  return (
    <TableProvider serverData={tableServerData}>
      <Design />
    </TableProvider>
  );
};

DesignPage.getLayout = function getLayout(page: ReactElement, pageProps) {
  return <SettingLayout {...pageProps}>{page}</SettingLayout>;
};

export default DesignPage;
