import { EntityRepository, UniqueConstraintViolationException } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { UserOrmEntity } from './user.orm-entity';
import { UserEntity } from '../entities/user.entity';
import { UserMapper } from '../entities/user.mapper';
import { UserEmailTakenError, UserHasDependenciesError } from 'src/modules/users/application/errors/user.error';
import { UserRepository } from '../repositories/user-repository.interface';

@Injectable()
export class UserRepositoryMikro implements UserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly userRepository: EntityRepository<UserOrmEntity>,
  ) {}

  async findAll(): Promise<UserEntity[]> {
    const ormUsers = await this.userRepository.findAll({ filters: { softDeleted: true } });
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

  async findById(id: string): Promise<UserEntity | null> {
    const ormUser = await this.userRepository.findOne({ id }, { filters: { softDeleted: true } });
    return ormUser ? UserMapper.toDomain(ormUser) : null;
  }

  async update(id: string, user: Partial<UserEntity>): Promise<UserEntity | null> {
    let updatedOrm: UserOrmEntity | null = null;

    try {
      await this.userRepository.getEntityManager().transactional(async (em) => {
        const ormUser = await em.findOne(UserOrmEntity, { id }, { filters: { softDeleted: true } });
        if (!ormUser) {
          return;
        }

        const partialOrm = UserMapper.toOrmPartial(user);
        const safePartial = Object.fromEntries(
          Object.entries(partialOrm).filter(([_, v]) => v !== null && v !== undefined),
        );

        Object.assign(ormUser, safePartial);

        // No need for explicit persist if no changes, but safe to do
        em.persist(ormUser);
        await em.flush();

        updatedOrm = ormUser;
      });
    } catch (e: unknown) {
      if ((e as any)?.code === '23505') {
        throw new UserEmailTakenError((user.email as string) || '');
      }
      throw e;
    }

    if (!updatedOrm) {
      return null;
    }

    return UserMapper.toDomain(updatedOrm);
  }

  async softDelete(id: string): Promise<boolean> {
    let deleted = false;

    try {
      await this.userRepository.getEntityManager().transactional(async (em) => {
        const ormUser = await em.findOne(UserOrmEntity, { id }, { filters: { softDeleted: true } });
        if (!ormUser) {
          return;
        }
        
        ormUser.deletedAt = new Date();
        em.persist(ormUser);
        await em.flush();

        deleted = true;
      });
    } catch (e: unknown) {
      if ((e as any)?.code === '23503') {
        throw new UserHasDependenciesError(id);
      }
      throw e;
    }

    return deleted;
  }
}
