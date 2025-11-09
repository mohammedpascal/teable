import type { IUserListVo, ICreateUserRo, IUpdateUserRo } from '@teable/openapi';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@teable/ui-lib/shadcn';
import { Button } from '@teable/ui-lib/shadcn';
import { Input } from '@teable/ui-lib/shadcn';
import { Label } from '@teable/ui-lib/shadcn';
import { Checkbox } from '@teable/ui-lib/shadcn';
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
  const isEdit = !!user;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin || false);
      setPassword('');
    } else {
      setName('');
      setEmail('');
      setPassword('');
      setIsAdmin(false);
    }
  }, [user, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit) {
      onSubmit({
        name,
        email,
        isAdmin,
      } as IUpdateUserRo);
    } else {
      onSubmit({
        name,
        email,
        password: password || undefined,
        isAdmin,
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
              : t('setting:users.addUserDescription', { defaultValue: 'Create a new user account' })}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">
                {t('setting:users.name', { defaultValue: 'Name' })}
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">
                {t('setting:users.email', { defaultValue: 'Email' })}
              </Label>
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
              <Label htmlFor="isAdmin" className="text-sm font-normal cursor-pointer">
                {t('setting:users.admin', { defaultValue: 'Admin' })}
              </Label>
            </div>
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

