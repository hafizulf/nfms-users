import { EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { UserOrmEntity } from './user.orm-entity';
import { UserEntity } from '../entities/user.entity';
import { UserMapper } from '../entities/user.mapper';

@Injectable()
export class UserRepositoryMikro {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly userRepository: EntityRepository<UserOrmEntity>,
  ) {}

  async findAll(): Promise<UserEntity[]> {
    const em = this.userRepository.getEntityManager().fork();
    const ormUsers = await em.find(UserOrmEntity, {});
    return ormUsers.map((ormUser) => UserMapper.toDomain(ormUser));
  }
}
