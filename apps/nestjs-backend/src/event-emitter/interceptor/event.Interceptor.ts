/* eslint-disable @typescript-eslint/no-explicit-any */
import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import type { Observable } from 'rxjs';
import { tap } from 'rxjs';
import { EMIT_EVENT_NAME } from '../decorators/emit-controller-event.decorator';
import { EventEmitterService } from '../event-emitter.service';
import type { Events } from '../events';

@Injectable()
export class EventMiddleware implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly eventEmitterService: EventEmitterService
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();
    const emitEventName = this.reflector.get<Events>(EMIT_EVENT_NAME, context.getHandler());

    return next.handle().pipe(
      tap((data) => {
        const interceptContext = this.interceptContext(req, data);
        this.eventEmitterService.emitAsync(emitEventName, interceptContext);
      })
    );
  }

  private interceptContext(req: Request, resolveData: any) {
    return {
      reqUser: req?.user as any,
      reqHeaders: req?.headers,
      reqParams: req?.params,
      reqQuery: req?.query,
      reqBody: req?.body,
      resolveData,
    };
  }
}
