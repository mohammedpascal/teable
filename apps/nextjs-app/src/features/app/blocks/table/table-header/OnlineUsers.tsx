import { useSession } from '@teable/sdk';
import { UserAvatar } from '@teable/sdk/components/cell-value/cell-user/UserAvatar';
import {
  HoverCard,
  HoverCardContent,
  HoverCardPortal,
  HoverCardTrigger,
  cn,
} from '@teable/ui-lib/shadcn';
import { useTableOnlineUsers } from './hooks/useTableOnlineUsers';

export const OnlineUsers = ({ className }: { className?: string }) => {
  const onlineUsers = useTableOnlineUsers();
  const { user: currentUser } = useSession();

  // Filter out current user
  const otherUsers = onlineUsers.filter((user) => user.id !== currentUser?.id);

  if (otherUsers.length === 0) {
    return null;
  }

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      {otherUsers.map((user) => (
        <HoverCard key={user.id} openDelay={200}>
          <HoverCardTrigger asChild>
            <div className="relative cursor-pointer overflow-hidden rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
              <UserAvatar
                name={user.name}
                avatar={user.avatar}
                size={24}
                className="size-6 border-2"
              />
            </div>
          </HoverCardTrigger>
          <HoverCardPortal>
            <HoverCardContent className="flex w-max max-w-[160px] flex-col justify-center truncate p-2 text-sm">
              <div className="truncate">
                <span title={user.name}>{user.name}</span>
                {user.id === currentUser?.id && <span className="pl-1">(you)</span>}
              </div>
              {user.email && (
                <div className="truncate">
                  <span title={user.email}>{user.email}</span>
                </div>
              )}
            </HoverCardContent>
          </HoverCardPortal>
        </HoverCard>
      ))}
    </div>
  );
};
