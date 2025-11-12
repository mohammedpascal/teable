import { SetMetadata } from '@nestjs/common';

export const ADMIN_KEY = 'admin';
// eslint-disable-next-line @typescript-eslint/naming-convention
export const Admin = () => SetMetadata(ADMIN_KEY, true);
