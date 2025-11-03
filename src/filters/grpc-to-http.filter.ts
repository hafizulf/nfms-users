import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { ServiceError, status } from '@grpc/grpc-js';
import { AppError } from 'src/modules/common/errors/app-error';
import { BadGatewayException, BadRequestException, GatewayTimeoutException, ServiceUnavailableException } from 'src/exceptions/common.exception';

@Catch(Error)
export class GrpcToHttpFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    if (!this.isGrpcError(exception)) throw exception;
  
    console.error('[HTTP filter] gRPC error', {
      code: exception?.code,
      message: exception?.message,
      details: exception?.details,
    });

    const res = host.switchToHttp().getResponse<FastifyReply>();
    const appErr = this.mapGrpcToAppException(exception as ServiceError);

    const statusCode = appErr?.httpStatus ?? HttpStatus.BAD_GATEWAY;
    const code = appErr?.code ?? 'UPSTREAM_ERROR';
    const upstreamMsg =
      typeof exception?.details === 'string' && exception.details.trim()
        ? exception.details
        : (typeof exception?.message === 'string' && exception.message.trim()
            ? exception.message
            : undefined);
    const message = upstreamMsg ?? appErr?.message ?? 'Upstream error';

    res.status(statusCode).send({ statusCode, code, message });
  }

  private isGrpcError(err: any): err is ServiceError {
    return err && typeof err.code === 'number';
  }

  private mapGrpcToAppException(err: ServiceError): AppError {
    const serviceName = (err as any).grpcSource ?? 'Remote';
    const msg = this.messageFrom(err);

    switch (err.code) {
      case status.INVALID_ARGUMENT:
        return new BadRequestException(msg ?? 'Invalid request');

      case status.UNAVAILABLE:
        return new ServiceUnavailableException(serviceName);

      case status.DEADLINE_EXCEEDED:
        return new GatewayTimeoutException(serviceName);

      default:
        return new BadGatewayException();
    }
  }

  private messageFrom(err: ServiceError): string | undefined {
    return (typeof err.details === 'string' && err.details.trim().length > 0)
      ? err.details
      : (typeof err.message === 'string' ? err.message : undefined);
  }
}
