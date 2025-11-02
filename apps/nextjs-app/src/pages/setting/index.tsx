import type { GetServerSideProps } from 'next';
import type { NextPageWithLayout } from '@/lib/type';

const Node: NextPageWithLayout = () => {
  return <p>redirecting</p>;
};

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: `/settings/access-tokens`,
      permanent: false,
    },
  };
};

export default Node;
