import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  HttpStatus,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, catchError, throwError } from 'rxjs';
import { AppError } from 'src/modules/common/errors/app-error';

@Injectable()
export class GrpcAppErrorInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        if (err instanceof AppError) {
          const grpcCode = this.mapHttpToGrpcStatus(err.httpStatus);
          return throwError(() => new RpcException({
            code: grpcCode,
            details: err.message,
          }));
        }
        return throwError(() => err);
      }),
    );
  }

  private mapHttpToGrpcStatus(httpStatus: number): number {
    switch (httpStatus) {
      case HttpStatus.BAD_REQUEST: return 3;    // INVALID_ARGUMENT
      case HttpStatus.UNAUTHORIZED: return 16;  // UNAUTHENTICATED
      case HttpStatus.FORBIDDEN: return 7;      // PERMISSION_DENIED
      case HttpStatus.NOT_FOUND: return 5;      // NOT_FOUND
      case HttpStatus.CONFLICT: return 6;       // ALREADY_EXISTS
      default: return 13;                       // INTERNAL
    }
  }
}
