import { Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { UserEntity } from 'src/modules/users/infrastucture/persistence/entities/user.entity';
import { FindUsersRequest, UserResponseDto } from "src/modules/users/interface/dto/user.dto";
import { FindUsersQuery } from '../query/find-users.query';
import { UserViewMapper } from '../../interface/mapper/user-view.mapper';

@Injectable()
export class UserRpcService {
  constructor(
    private readonly _queryBus: QueryBus,
  ) {}

  async findUsers(_params: FindUsersRequest): Promise<UserResponseDto[]> {
    const users: UserEntity[] = await this._queryBus.execute(
      new FindUsersQuery(_params),
    )

    return users.map((user) => UserViewMapper.toResponseDto(user));
  }
}
