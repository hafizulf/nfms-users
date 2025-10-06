import { IsString, IsEmail, IsNotEmpty, MinLength, IsUUID, IsOptional } from 'class-validator';
import { AtLeastOneProperty } from '../../../common/decorators/at-least-one-property.decorator';

export class UserResponseDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  created_at: string;

  @IsString()
  updated_at: string;
}

export class FindUsersRequest {}

export class FindUsersResponse {
  users: UserResponseDto[];
}

export class CreateUserRequest {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}

export class FindOneUserRequest {
  @IsUUID('7', { message: "Id must be a valid uuid" })
  id!: string;
}

export class FindOneUserResponse {
  user: UserResponseDto;
}

export class UpdateUserRequest {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @AtLeastOneProperty(['name', 'email'])
  _validateAtLeastOne?: never;
}
