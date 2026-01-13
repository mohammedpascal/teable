import { Avatar, AvatarFallback, AvatarImage, cn } from '@/ui-lib/shadcn';
import React from 'react';

interface UserAvatarProps {
  user: { name: string; avatar?: string | null };
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const UserAvatar: React.FC<UserAvatarProps> = (props) => {
  const { user, width = 28, height = 28, className, style } = props;
  const { name, avatar } = user;

  return (
    <Avatar className={cn('size-7', className)} style={style}>
      {avatar && (
        <AvatarImage
          src={avatar}
          alt={name}
          width={width}
          height={height}
          style={{ objectFit: 'cover' }}
        />
      )}
      <AvatarFallback>{name.slice(0, 1)}</AvatarFallback>
    </Avatar>
  );
};
