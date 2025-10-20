import { UserEntity } from './user.entity';
import { UserOrmEntity } from '../mikro/user.orm-entity';
import { UserResponseDto } from 'src/modules/users/interface/dto/user.dto';

export class UserMapper {
  static toDomain(e: UserOrmEntity): UserEntity {
    return UserEntity.rehydrate(
      e.id,
      e.name,
      e.email,
      e.passwordHash,
      e.is_email_verified,
      e.email_verified_at,
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
    e.is_email_verified = d.is_email_verified;
    e.email_verified_at = d.email_verified_at;
    e.createdAt = d.createdAt;
    e.updatedAt = d.updatedAt;
    return e;
  }

  static toDto(d: UserEntity): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = d.id;
    dto.name = d.name;
    dto.email = d.email;
    dto.is_email_verified = d.is_email_verified;
    dto.created_at = d.createdAt.toISOString();
    dto.updated_at = d.updatedAt.toISOString();
    return dto;
  }

  static toOrmPartial(domainUser: Partial<UserEntity>): Partial<UserOrmEntity> {
    return {
      name: domainUser.name,
      email: domainUser.email,
    };
  }
}
