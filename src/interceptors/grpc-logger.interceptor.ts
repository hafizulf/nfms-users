import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class GrpcLoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger(GrpcLoggerInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const callName = `${context.getClass().name}.${context.getHandler().name}`;
    const start = Date.now();

    // Only log for gRPC context
    if (context.getType() === 'rpc') {
      const requestData = context.switchToRpc().getData();
      this.logger.log(`${callName} called with: ${JSON.stringify(requestData)}`);
    }

    return next.handle().pipe(
      tap(() => {
        if (context.getType() === 'rpc') {
          this.logger.log(`${callName} finished in ${Date.now() - start}ms`);
        }
      }),
    );
  }
}
