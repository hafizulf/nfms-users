import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Inject } from '@nestjs/common';
import { Observable, from, lastValueFrom } from 'rxjs';
import { MikroORM, RequestContext } from '@mikro-orm/core';

@Injectable()
export class MikroOrmGrpcContextInterceptor implements NestInterceptor {
  constructor(@Inject(MikroORM) private readonly orm: MikroORM) {}

  intercept(_ctx: ExecutionContext, next: CallHandler): Observable<any> {
    return from(
      new Promise((resolve, reject) => {
        RequestContext.create(this.orm.em, () => {
          lastValueFrom(next.handle()).then(resolve, reject);
        });
      }),
    );
  }
}
