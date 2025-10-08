import { ServiceError, status } from '@grpc/grpc-js';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { throwError } from 'rxjs';

@Catch(RpcException)
export class RpcExceptionHttpFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const error = exception.getError();
    if (typeof error === 'object' && error && 'code' in (error as any)) {
      const e = error as Partial<ServiceError> & { details?: string };
      return throwError(() => ({ code: e.code ?? status.UNKNOWN, details: e.details ?? 'Error' }));
    }
    const details = typeof error === 'string' ? error : 'Error';
    return throwError(() => ({ code: status.UNKNOWN, details }));
  }
}
