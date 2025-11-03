import { UserEntity } from '../../infrastucture/persistence/entities/user.entity';
import { UserResponseDto } from '../dto/user.dto';

export class UserViewMapper {
  static toResponseDto(user: UserEntity): UserResponseDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      is_email_verified: user.is_email_verified,
      avatar_path: user.avatar_path,
      created_at: user.createdAt.toISOString(),
      updated_at: user.updatedAt.toISOString(),
    };
  }
}
