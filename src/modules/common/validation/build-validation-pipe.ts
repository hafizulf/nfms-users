import {
  UnprocessableEntityException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { status as GrpcStatus } from '@grpc/grpc-js';

export function buildHttpValidationPipe() {
  return new ValidationPipe({
    transform: false,
    whitelist: true,
    forbidUnknownValues: true,
    exceptionFactory: (errors: ValidationError[]) => {
      return new UnprocessableEntityException({
        statusCode: 422,
        message: 'Validation errors',
        errors: errors.map(e => ({
          field: e.property,
          constraints: e.constraints,
        })),
      });
    },
  });
}

export function buildGrpcValidationPipe() {
  return new ValidationPipe({
    transform: false,
    whitelist: true,
    forbidUnknownValues: true,
    exceptionFactory: (errors: ValidationError[]) => {
      const details = {
        errors: errors.map(e => ({
          field: e.property,
          constraints: e.constraints,
        })),
      };
      return new RpcException({
        code: GrpcStatus.INVALID_ARGUMENT,
        message:
          details.errors
            .map(e => `${e.field}: ${Object.values(e.constraints ?? {}).join(', ')}`)
            .join(' | ') || 'Validation failed',
        // Postman shows only message, but some clients will read this:
        details: JSON.stringify(details),
      });
    },
  });
}
