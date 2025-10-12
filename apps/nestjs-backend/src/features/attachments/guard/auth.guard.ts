import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '../../auth/guard/auth.guard';

@Injectable()
export class DynamicAuthGuardFactory implements CanActivate {
  constructor(private readonly authGuard: AuthGuard) {}
  
  canActivate(context: ExecutionContext) {
    return this.authGuard.validate(context);
  }
}
