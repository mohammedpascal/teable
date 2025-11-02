import { Separator } from '@teable/ui-lib/shadcn';
import Head from 'next/head';
import React from 'react';

interface ISettingRight {
  title?: string | React.ReactNode;
  children: React.ReactNode;
  headerActions?: React.ReactNode;
}

export const SettingRight = (props: ISettingRight) => {
  const { title, children, headerActions } = props;
  return (
    <div className="size-full">
      {typeof title === 'string' && (
        <Head>
          <title>{title}</title>
        </Head>
      )}
      <div className="flex h-full flex-1 flex-col">
        <div className="flex h-16 items-center gap-x-4 px-8">
          {typeof title === 'string' ? <h2 className="flex-1 text-base">{title}</h2> : title}
          {headerActions && <div className="flex items-center gap-2">{headerActions}</div>}
        </div>
        <Separator />
        <div className="flex-1 overflow-y-auto px-8">{children}</div>
      </div>
    </div>
  );
};
