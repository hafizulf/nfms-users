import {
  UnprocessableEntityException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { status as GrpcStatus } from '@grpc/grpc-js';

type Mode = 'http' | 'rpc';

export function buildValidationPipe(mode: Mode) {
  return new ValidationPipe({
    transform: true,
    whitelist: true,  // strip unknown fields
    transformOptions: { enableImplicitConversion: true },
    exceptionFactory: (errors: ValidationError[]) => {
      const payload = {
        message: 'Validation errors',
        errors: errors.map(e => ({
          field: e.property,
          constraints: e.constraints,
        })),
      };

      if (mode === 'http') {
        // 422 for HTTP
        return new UnprocessableEntityException({
          statusCode: 422,
          ...payload,
        });
      }

      // gRPC: map to INVALID_ARGUMENT for future use
      return new RpcException({
        code: GrpcStatus.INVALID_ARGUMENT,
        ...payload,
      });
    },
  });
}
