import { useQuery } from '@tanstack/react-query';
import type { IUserListVo, ICreateUserRo, IUpdateUserRo } from '@teable/openapi';
import { getRoleList } from '@teable/openapi';
import { useSession } from '@/sdk/hooks';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Button,
  Input,
  Label,
  Checkbox,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@teable/ui-lib/shadcn';
import { useTranslation } from 'next-i18next';
import { useState, useEffect } from 'react';

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: IUserListVo | null;
  onSubmit: (data: ICreateUserRo | IUpdateUserRo) => void;
  isLoading: boolean;
}

export const UserDialog = ({ open, onOpenChange, user, onSubmit, isLoading }: UserDialogProps) => {
  const { t } = useTranslation(['common', 'setting']);
  const { user: currentUser } = useSession();
  const isCurrentUserAdmin = currentUser?.isAdmin === true;
  const isEdit = !!user;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [roleId, setRoleId] = useState<string | null>(null);

  // Fetch roles list only if current user is admin
  const { data: roles = [], isLoading: rolesLoading } = useQuery({
    queryKey: ['role-list'],
    queryFn: () => getRoleList().then((res) => res.data),
    enabled: open && isCurrentUserAdmin,
  });

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin || false);
      setRoleId(user.roleId || null);
      setPassword('');
    } else {
      setName('');
      setEmail('');
      setPassword('');
      setIsAdmin(false);
      setRoleId(null);
    }
  }, [user, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit) {
      onSubmit({
        name,
        email,
        isAdmin,
        roleId: roleId || null,
      } as IUpdateUserRo);
    } else {
      onSubmit({
        name,
        email,
        password: password || undefined,
        isAdmin,
        roleId: roleId || null,
      } as ICreateUserRo);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit
              ? t('setting:users.editUser', { defaultValue: 'Edit User' })
              : t('setting:users.addUser', { defaultValue: 'Add User' })}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? t('setting:users.editUserDescription', { defaultValue: 'Update user information' })
              : t('setting:users.addUserDescription', {
                  defaultValue: 'Create a new user account',
                })}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">{t('setting:users.name', { defaultValue: 'Name' })}</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">{t('setting:users.email', { defaultValue: 'Email' })}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            {!isEdit && (
              <div className="grid gap-2">
                <Label htmlFor="password">
                  {t('setting:users.password', { defaultValue: 'Password' })} (optional)
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  disabled={isLoading}
                  placeholder={t('setting:users.passwordPlaceholder', {
                    defaultValue: 'Leave empty to skip password',
                  })}
                />
              </div>
            )}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isAdmin"
                checked={isAdmin}
                onCheckedChange={(checked) => setIsAdmin(checked === true)}
                disabled={isLoading}
              />
              <Label htmlFor="isAdmin" className="cursor-pointer text-sm font-normal">
                {t('setting:users.admin', { defaultValue: 'Admin' })}
              </Label>
            </div>
            {!isAdmin && isCurrentUserAdmin && (
              <div className="grid gap-2">
                <Label htmlFor="role">{t('setting:users.role', { defaultValue: 'Role' })}</Label>
                <Select
                  value={roleId || '__none__'}
                  onValueChange={(value) => setRoleId(value === '__none__' ? null : value)}
                  disabled={isLoading || rolesLoading}
                >
                  <SelectTrigger id="role">
                    <SelectValue
                      placeholder={t('setting:users.noRole', { defaultValue: 'No role' })}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">
                      {t('setting:users.noRole', { defaultValue: 'No role' })}
                    </SelectItem>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              {t('common:cancel', { defaultValue: 'Cancel' })}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? t('common:loading', { defaultValue: 'Loading...' })
                : isEdit
                  ? t('common:save', { defaultValue: 'Save' })
                  : t('common:create', { defaultValue: 'Create' })}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
