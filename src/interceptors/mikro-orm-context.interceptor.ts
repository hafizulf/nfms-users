import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Inject } from '@nestjs/common';
import { lastValueFrom, from } from 'rxjs';
import { MikroORM, RequestContext } from '@mikro-orm/core';

@Injectable()
export class MikroOrmContextInterceptor implements NestInterceptor {
  constructor(@Inject(MikroORM) private readonly orm: MikroORM) {}

  intercept(_ctx: ExecutionContext, next: CallHandler) {
    const promise = new Promise((resolve, reject) => {
      RequestContext.create(this.orm.em, () => {
        lastValueFrom(next.handle()).then(resolve, reject);
      });
    });

    return from(promise);
  }
}
