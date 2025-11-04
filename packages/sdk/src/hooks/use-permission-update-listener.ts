import { getBasePermissionUpdateChannel } from '@teable/core';
import { useEffect, useState } from 'react';
import type { Presence } from 'sharedb/lib/sharedb';
import { useConnection } from './use-connection';

export const usePermissionUpdateListener = (trigger: () => void) => {
  const [remotePresence, setRemotePresence] = useState<Presence>();
  const { connection } = useConnection();

  useEffect(() => {
    if (connection == null) return;
    const channel = getBasePermissionUpdateChannel('bse0');
    setRemotePresence(connection.getPresence(channel));

    remotePresence?.subscribe((err) => err && console.error);

    const receiveHandler = (_id: string) => {
      trigger();
    };

    remotePresence?.on('receive', receiveHandler);

    return () => {
      remotePresence?.removeListener('receive', receiveHandler);
      remotePresence?.listenerCount('receive') === 0 && remotePresence?.unsubscribe();
      remotePresence?.listenerCount('receive') === 0 && remotePresence?.destroy();
    };
  }, [connection, remotePresence, trigger]);
};
