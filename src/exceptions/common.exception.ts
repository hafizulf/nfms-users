import { HttpStatus } from "@nestjs/common";
import { AppError } from "src/modules/common/errors/app-error";
import { COMMON_ERROR_CODES } from "src/modules/common/errors/error-codes";

export class ServiceUnavailableException extends AppError {
  constructor(serviceName: string) {
    super(COMMON_ERROR_CODES.SERVICE_UNAVAILABLE, `${serviceName} Service Unavailable`, HttpStatus.SERVICE_UNAVAILABLE);
  }
}

export class GatewayTimeoutException extends AppError {
  constructor(serviceName: string) {
    super(COMMON_ERROR_CODES.SERVICE_TIMEOUT, `${serviceName} Service Timeout`, HttpStatus.GATEWAY_TIMEOUT);
  }
}

export class BadGatewayException extends AppError {
  constructor() {
    super(COMMON_ERROR_CODES.UPSTREAM_ERROR, `Upstream error`, HttpStatus.BAD_GATEWAY);
  }
}

export class BadRequestException extends AppError {
  constructor(message: string) {
    super(COMMON_ERROR_CODES.BAD_REQUEST, message, HttpStatus.BAD_REQUEST);
  }
}

export class ConflictException extends AppError {
  constructor(message: string) {
    super(COMMON_ERROR_CODES.CONFLICT, message, HttpStatus.CONFLICT);
  }
}

export class NotFoundException extends AppError {
  constructor(message: string) {
    super(COMMON_ERROR_CODES.NOT_FOUND, message, HttpStatus.NOT_FOUND);
  }
}

export class ForbiddenException extends AppError {
  constructor(message: string) {
    super(COMMON_ERROR_CODES.FORBIDDEN, message, HttpStatus.FORBIDDEN);
  }
}
