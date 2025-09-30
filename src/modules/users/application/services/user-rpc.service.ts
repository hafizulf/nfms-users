import { Inject, Injectable } from '@nestjs/common';
import { UserEntity } from 'src/modules/users/infrastucture/persistence/entities/user.entity';
import { UserMapper } from 'src/modules/users/infrastucture/persistence/entities/user.mapper';
import { UserRepository } from 'src/modules/users/infrastucture/persistence/repositories/user-repository.interface';
import { REPOSITORY_TYPES } from 'src/modules/users/infrastucture/persistence/repositories/user-repository.types';
import { UserResponseDto } from "src/modules/users/interface/dto/user.dto";

@Injectable()
export class UserRpcService {
  constructor(
    @Inject(REPOSITORY_TYPES.UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async findUsers(): Promise<UserResponseDto[]> {
    const users: UserEntity[] = await this.userRepository.findAll();
    return users.map((user) => UserMapper.toDto(user));
  }
}
