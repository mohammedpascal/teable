import { getCollaboratorsChannel } from '@teable/core';
import type { IUser } from '@/sdk';
import { useSession } from '@/sdk';
import { useConnection, useTableId } from '@/sdk/hooks';
import { useEffect, useState, useMemo } from 'react';
import type { Presence } from 'sharedb/lib/sharedb';

interface IPresenceData {
  user: Omit<IUser, 'phone'>;
  [key: string]: unknown;
}

export const useTableOnlineUsers = () => {
  const tableId = useTableId();
  const { connection } = useConnection();
  const { user } = useSession();
  const [presence, setPresence] = useState<Presence>();
  const [onlineUsers, setOnlineUsers] = useState<Omit<IUser, 'phone'>[]>([]);

  useEffect(() => {
    if (!tableId || !connection) {
      return;
    }
    const channel = getCollaboratorsChannel(tableId);
    setPresence(connection.getPresence(channel));
  }, [connection, tableId]);

  const localPresence = useMemo(() => {
    if (presence && connection?.id && user?.id) {
      return presence.create(`${tableId}_${user.id}_${connection.id}`);
    }
    return null;
  }, [connection?.id, presence, tableId, user?.id]);

  useEffect(() => {
    const receiveHandler = () => {
      if (presence?.remotePresences) {
        const usersMap = new Map<string, Omit<IUser, 'phone'>>();

        // Extract unique users from all presence entries
        Object.values(presence.remotePresences).forEach((presenceData) => {
          const data = presenceData as IPresenceData;
          if (data?.user?.id) {
            usersMap.set(data.user.id, data.user);
          }
        });

        setOnlineUsers(Array.from(usersMap.values()));
      } else {
        setOnlineUsers([]);
      }
    };

    if (presence) {
      if (!presence.subscribed) {
        presence.subscribe((err) => {
          err && console.error('Presence subscribe error:', err);
        });
      }
      presence.on('receive', receiveHandler);
      // Trigger initial load
      receiveHandler();
    }

    return () => {
      presence?.removeListener('receive', receiveHandler);
      if (presence && presence.listenerCount('receive') === 0) {
        presence.unsubscribe();
      }
    };
  }, [presence]);

  // Submit our own presence to indicate we're viewing the table
  useEffect(() => {
    if (!localPresence || !user) {
      return;
    }

    localPresence.submit(
      {
        user: {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          email: user.email,
        },
      },
      (error) => {
        error && console.error('Submit presence error:', error);
      }
    );

    return () => {
      // Clean up presence when component unmounts
      localPresence.submit(null, (error) => {
        error && console.error('Clear presence error:', error);
      });
    };
  }, [localPresence, user]);

  return onlineUsers;
};
