import type { IUserListVo } from '@teable/openapi';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@teable/ui-lib/shadcn';
import { Button } from '@teable/ui-lib/shadcn';
import { Edit, Trash2 } from '@teable/icons';
import { UserAvatar } from '@/features/app/components/user/UserAvatar';
import { useTranslation } from 'next-i18next';

interface UsersGridViewProps {
  users: IUserListVo[];
  total: number;
  isLoading: boolean;
  onEdit: (user: IUserListVo) => void;
  onDelete: (id: string) => void;
}

export const UsersGridView = ({ users, isLoading, onEdit, onDelete }: UsersGridViewProps) => {
  const { t } = useTranslation(['common', 'setting']);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-sm text-muted-foreground">
          {t('common:loading', { defaultValue: 'Loading...' })}
        </p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-sm text-muted-foreground">
          {t('setting:users.noUsers', { defaultValue: 'No users found' })}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('setting:users.name', { defaultValue: 'Name' })}</TableHead>
            <TableHead>{t('setting:users.email', { defaultValue: 'Email' })}</TableHead>
            <TableHead>{t('setting:users.role', { defaultValue: 'Role' })}</TableHead>
            <TableHead>{t('setting:users.created', { defaultValue: 'Created' })}</TableHead>
            <TableHead>{t('setting:users.lastSignIn', { defaultValue: 'Last Sign In' })}</TableHead>
            <TableHead className="text-right">{t('common:actions', { defaultValue: 'Actions' })}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <UserAvatar user={user} />
                  <span className="font-medium">{user.name}</span>
                </div>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                {user.isAdmin ? (
                  <span className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
                    {t('setting:users.admin', { defaultValue: 'Admin' })}
                  </span>
                ) : (
                  <span className="text-muted-foreground text-xs">
                    {t('setting:users.user', { defaultValue: 'User' })}
                  </span>
                )}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {user.createdTime
                  ? new Date(user.createdTime).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })
                  : '-'}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {user.lastSignTime
                  ? new Date(user.lastSignTime).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })
                  : '-'}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(user)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(user.id)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

