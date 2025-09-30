import { EntityRepository, UniqueConstraintViolationException } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { UserOrmEntity } from './user.orm-entity';
import { UserEntity } from '../entities/user.entity';
import { UserMapper } from '../entities/user.mapper';
import { UserEmailTakenError } from 'src/modules/users/application/errors/user.error';

@Injectable()
export class UserRepositoryMikro {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly userRepository: EntityRepository<UserOrmEntity>,
  ) {}

  async findAll(): Promise<UserEntity[]> {
    const ormUsers = await this.userRepository.findAll();
    return ormUsers.map((ormUser) => UserMapper.toDomain(ormUser));
  }

  async save(user: UserEntity): Promise<UserEntity> {
    const orm = UserMapper.toOrm(user); // tracking entity
    try {
      await this.userRepository.getEntityManager().transactional(async (em) => {
        em.persist(orm);
        await em.flush();
      });
    } catch (e: unknown) {
      if ((e as any)?.code === '23505') throw new UserEmailTakenError(orm.email);
      throw e;
    }

    return UserMapper.toDomain(orm);
  }
}
