import { useMutation } from '@tanstack/react-query';
import { HttpError, HttpErrorCode } from '@teable/core';
import { getTableById } from '@teable/openapi';
import { useConnection } from '@/sdk/hooks';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useEffect } from 'react';
import type { ConnectionReceiveRequest } from 'sharedb/lib/sharedb';

export const useViewErrorHandler = (tableId: string, viewId: string) => {
  const navigate = useNavigate();
  const search = useSearch({ strict: false });
  const { connection } = useConnection();

  const { mutate: redirectDefaultView } = useMutation({
    mutationFn: (tableId: string) => getTableById(tableId),
    onSuccess: (data) => {
      const defaultViewId = data.data.defaultViewId;
      navigate({
        to: '/table/$tableId/$viewId',
        params: {
          tableId,
          viewId: defaultViewId,
        },
        replace: Boolean(defaultViewId),
      });
    },
  });

  useEffect(() => {
    if (!tableId || !connection) {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const errorHandler = (error: any) => {
      const httpError = new HttpError(error, error?.status || 500);
      if (httpError.code === HttpErrorCode.VIEW_NOT_FOUND) {
        redirectDefaultView(tableId);
      }
    };

    const handleViewDeletion = (data: unknown) => {
      if (typeof data === 'object' && data !== null) {
        const { d, del } = data as { d?: string; del?: boolean };
        if (d === viewId && del === true) {
          redirectDefaultView(tableId);
        }
      }
    };

    const onReceive = (request: ConnectionReceiveRequest) => {
      if (request.data.error) {
        errorHandler(request.data.error);
      } else {
        handleViewDeletion(request.data);
      }
    };
    connection.on('receive', onReceive);

    return () => {
      connection.removeListener('receive', onReceive);
    };
  }, [connection, redirectDefaultView, tableId, viewId]);
};
