import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Inject } from '@nestjs/common';
import { Observable } from 'rxjs';
import { RequestContext } from '@mikro-orm/core';
import { MikroORM } from '@mikro-orm/core';

@Injectable()
export class MikroOrmContextInterceptor implements NestInterceptor {
  constructor(@Inject(MikroORM) private readonly orm: MikroORM) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return new Observable((observer) => {
      RequestContext.create(this.orm.em, () => {
        next.handle().subscribe({
          next: (value) => observer.next(value),
          error: (err) => observer.error(err),
          complete: () => observer.complete(),
        });
      });
    });
  }
}
