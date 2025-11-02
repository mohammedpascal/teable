import type { CreateAccessTokenVo, UpdateAccessTokenVo } from '@teable/openapi';
import { ArrowUpRight, Plus } from '@teable/icons';
import { Button } from '@teable/ui-lib/shadcn';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useEffect, useRef } from 'react';
import { SettingRight } from '../SettingRight';
import { AccessTokenList } from './AccessTokenList';
import { personalAccessTokenConfig } from '@/features/i18n/personal-access-token.config';
import type { IFormType } from './form/AccessTokenForm';
import { PersonAccessTokenForm } from './PersonAccessTokenForm';
import { PersonAccessTokenTitle } from './PersonAccessTokenTitle';

export const PersonAccessTokenPage = () => {
  const router = useRouter();
  const { baseId, form: _form, id: _id, ...restQuery } = router.query;
  const formType = router.query.form as IFormType;
  const newTokenRef = useRef<string>();
  const { t } = useTranslation('common');
  const { t: tokenT } = useTranslation(personalAccessTokenConfig.i18nNamespaces);

  const backList = () => {
    newTokenRef.current = undefined;
    router.push({
      pathname: router.pathname,
      query: { ...restQuery, baseId },
    });
  };

  const onSubmit = (params: CreateAccessTokenVo | UpdateAccessTokenVo) => {
    if (formType === 'new') {
      newTokenRef.current = (params as CreateAccessTokenVo).token;
    }
    router.push({
      pathname: router.pathname,
      query: { ...restQuery, baseId },
    });
  };

  const onRefresh = (token: string) => {
    newTokenRef.current = token;
    router.push({
      pathname: router.pathname,
      query: { ...restQuery, baseId },
    });
  };

  useEffect(() => {
    if (router.query) {
      newTokenRef.current = undefined;
    }
  }, [router.query]);

  const headerActions =
    !formType ? (
      <>
        <Button size={'xs'} variant="link" className="space-x-1" asChild>
          <Link href="/developer/tool/query-builder">
            <ArrowUpRight />
            {tokenT('developer:apiQueryBuilder')}
          </Link>
        </Button>
        <Button
          size={'xs'}
          className="space-x-1"
          onClick={() => {
            router.push({
              pathname: router.pathname,
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
