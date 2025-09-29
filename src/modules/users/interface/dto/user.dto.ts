import { IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator';

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