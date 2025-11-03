import { HttpStatus } from "@nestjs/common";
import { AppError } from "src/modules/common/errors/app-error";
import { ERROR_CODES } from "src/modules/common/errors/error-codes";

export class UserEmailTakenError extends AppError {
  constructor(email: string) {
    super(ERROR_CODES.USER_EMAIL_TAKEN, `Email already taken: ${email}`, HttpStatus.CONFLICT);
  }
}

export class UserNotFoundError extends AppError {
  constructor(id: string) {
    super(ERROR_CODES.USER_NOT_FOUND, `User not found: ${id}`, HttpStatus.NOT_FOUND);
  }
}

export class UserHasDependenciesError extends AppError {
  constructor(id: string) {
    super(ERROR_CODES.USER_HAS_DEPENDENCIES, `User has dependencies: ${id}`, HttpStatus.CONFLICT);
  }
}

export class ImageNotFoundError extends AppError {
  constructor(id: string) {
    super(ERROR_CODES.USER_NOT_FOUND, `Image not found for user: ${id}`, HttpStatus.NOT_FOUND);
  }
}
