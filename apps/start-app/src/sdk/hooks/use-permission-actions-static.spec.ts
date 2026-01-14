import { ActionPrefix } from '@teable/core';
import { renderHook } from '@testing-library/react';
import { createAppContext } from '../context/__tests__/createAppContext';
import { usePermissionActionsStatic } from './use-permission-actions-static';

describe('usePermissionActionsStatic', () => {
  it('returns all actions', () => {
    const { result } = renderHook(() => usePermissionActionsStatic(), {
      wrapper: createAppContext(),
    });
    expect(Object.keys(result.current.actionPrefixStaticMap)).toEqual(
      expect.arrayContaining([
        ActionPrefix.Table,
        ActionPrefix.View,
        ActionPrefix.Record,
        ActionPrefix.Field,
      ])
    );
  });

  it('action description should be translated', () => {
    const { result } = renderHook(() => usePermissionActionsStatic(), {
      wrapper: createAppContext(),
    });
    expect(result.current.actionStaticMap['table|manage'].description).toEqual('Manage table');
  });
});
