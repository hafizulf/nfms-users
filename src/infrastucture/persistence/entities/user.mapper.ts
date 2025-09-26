import { UserEntity } from './user.entity';
import { UserOrmEntity } from '../mikro/user.orm-entity';
import { UserResponseDto } from 'src/users/interface/dto/user.dto';

export class UserMapper {
  static toDomain(e: UserOrmEntity): UserEntity {
    return UserEntity.rehydrate(
      e.id,
      e.name,
      e.email,
      e.passwordHash,
      e.createdAt,
      e.updatedAt,
    );
  }

  static toOrm(d: UserEntity): UserOrmEntity {
    const e = new UserOrmEntity();
    e.id = d.id;
    e.name = d.name;
    e.email = d.email;
    e.passwordHash = d.passwordHash;
    e.createdAt = d.createdAt;
    e.updatedAt = d.updatedAt;
    return e;
  }

  static toDto(d: UserEntity): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = d.id;
    dto.name = d.name;
    dto.email = d.email;
    dto.created_at = d.createdAt.toISOString();
    dto.updated_at = d.updatedAt.toISOString();
    return dto;
  }
}
