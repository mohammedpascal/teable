import type { IAppContext } from '@/sdk/context';
import { AppContext, FieldContext, ViewContext } from '@/sdk/context';
import { defaultLocale } from '@/sdk/context/app/i18n';
import type { IFieldInstance, IViewInstance } from '@/sdk/model';
import type { FC, PropsWithChildren } from 'react';
import { I18nextTestStubProvider } from './I18nextTestStubProvider';

export const createAppContext = (context: Partial<IAppContext> = {}) => {
  const defaultContext: IAppContext = {
    locale: defaultLocale,
  };
  // eslint-disable-next-line react/display-name
  return ({ children }: { children: React.ReactNode }) => (
    <AppContext.Provider value={{ ...defaultContext, ...context }}>{children}</AppContext.Provider>
  );
};

const MockProvider = createAppContext();

export const AppTestProviders: FC<PropsWithChildren> = ({ children }) => {
  return (
    <I18nextTestStubProvider>
      <MockProvider>{children}</MockProvider>
    </I18nextTestStubProvider>
  );
};

export const TestAnchorProvider: FC<
  PropsWithChildren & {
    fields?: IFieldInstance[];
    views?: IViewInstance[];
  }
> = ({ children, fields = [], views = [] }) => {
  return (
    <ViewContext.Provider value={{ views }}>
      <FieldContext.Provider value={{ fields }}>{children}</FieldContext.Provider>
    </ViewContext.Provider>
  );
};
