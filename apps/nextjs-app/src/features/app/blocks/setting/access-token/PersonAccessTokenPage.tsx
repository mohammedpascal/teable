import { Plus } from '@teable/icons';
import type { CreateAccessTokenVo, UpdateAccessTokenVo } from '@teable/openapi';
import { Button } from '@teable/ui-lib/shadcn';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useEffect, useRef } from 'react';
import { personalAccessTokenConfig } from '@/features/i18n/personal-access-token.config';
import { SettingRight } from '../SettingRight';
import { AccessTokenList } from './AccessTokenList';
import type { IFormType } from './form/AccessTokenForm';
import { PersonAccessTokenForm } from './PersonAccessTokenForm';
import { PersonAccessTokenTitle } from './PersonAccessTokenTitle';

export const PersonAccessTokenPage = () => {
  const router = useRouter();
  const baseId = 'bse0';
  const { form: _form, id: _id, ...restQuery } = router.query;
  const formType = router.query.form as IFormType;
  const newTokenRef = useRef<string>();
  const { t: tokenT } = useTranslation(personalAccessTokenConfig.i18nNamespaces);

  const backList = () => {
    newTokenRef.current = undefined;
    router.push({
      pathname: '/settings/access-tokens',
      query: restQuery,
    });
  };

  const onSubmit = (params: CreateAccessTokenVo | UpdateAccessTokenVo) => {
    if (formType === 'new') {
      newTokenRef.current = (params as CreateAccessTokenVo).token;
    }
    router.push({
      pathname: '/settings/access-tokens',
      query: restQuery,
    });
  };

  const onRefresh = (token: string) => {
    newTokenRef.current = token;
    router.push({
      pathname: '/settings/access-tokens',
      query: restQuery,
    });
  };

  useEffect(() => {
    if (router.query) {
      newTokenRef.current = undefined;
    }
  }, [router.query]);

  const headerActions = !formType ? (
    <>
      <Button
        size={'xs'}
        className="space-x-1"
        onClick={() => {
          router.push({
            pathname: '/settings/access-tokens',
            query: { ...router.query, form: 'new' },
          });
        }}
      >
        <Plus />
        {tokenT('token:new.button')}
      </Button>
    </>
  ) : undefined;

  return (
    <SettingRight
      title={<PersonAccessTokenTitle backList={backList} />}
      headerActions={headerActions}
    >
      <div className="my-3 space-y-1">
        {formType ? (
          <PersonAccessTokenForm onSubmit={onSubmit} onRefresh={onRefresh} onCancel={backList} />
        ) : (
          <AccessTokenList newToken={newTokenRef.current} />
        )}
      </div>
    </SettingRight>
  );
};
