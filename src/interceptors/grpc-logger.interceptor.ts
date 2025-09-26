import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class GrpcLoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const handler = context.getHandler().name;
    const className = context.getClass().name;
    const now = Date.now();

    // gRPC context
    const rpcContext = context.switchToRpc();
    const data = rpcContext.getData(); // gRPC request payload

    console.log(
      `[gRPC] ${className}.${handler} called with:`,
      JSON.stringify(data),
    );

    return next
      .handle()
      .pipe(
        tap(() =>
          console.log(
            `[gRPC] ${className}.${handler} finished in ${Date.now() - now}ms`,
          ),
        ),
      );
  }
}
