import { useSession } from '@teable/sdk';
import { UserAvatar } from '@teable/sdk/components/cell-value/cell-user/UserAvatar';
import { HoverCard, HoverCardContent, HoverCardTrigger, cn } from '@teable/ui-lib/shadcn';
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
        <HoverCard key={user.id}>
          <HoverCardTrigger asChild>
            <button className="cursor-pointer rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
              <UserAvatar
                name={user.name}
                avatar={user.avatar}
                size={20}
                className="size-5 border"
              />
            </button>
          </HoverCardTrigger>
          <HoverCardContent className="w-auto p-2">
            <div className="text-sm font-medium">{user.name}</div>
          </HoverCardContent>
        </HoverCard>
      ))}
    </div>
  );
};
