import { Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { UserEntity } from 'src/modules/users/infrastucture/persistence/entities/user.entity';
import { FindOneUserRequest, FindUserByEmailRequest, FindUsersRequest, UserResponseDto } from "src/modules/users/interface/dto/user.dto";
import { FindUsersQuery } from '../query/find-users.query';
import { UserViewMapper } from '../../interface/mapper/user-view.mapper';
import { FindOneUserQuery } from '../query/find-one-user.query';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { FindUserByEmailQuery } from '../query/find-user-by-email.query';

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

  async findOneUser(params: FindOneUserRequest): Promise<UserResponseDto> {
    const user: UserEntity = await this._queryBus.execute(
      new FindOneUserQuery(params.id),
    )

    if (!user) throw new RpcException({ code: status.NOT_FOUND, message: 'User not found' });

    return UserViewMapper.toResponseDto(user);
  }

  async findUserByEmail(params: FindUserByEmailRequest): Promise<UserResponseDto> {
    const user: UserEntity = await this._queryBus.execute(
      new FindUserByEmailQuery(params.email),
    )

    if (!user) throw new RpcException({ code: status.NOT_FOUND, message: 'User not found' });

    return UserViewMapper.toResponseDto(user);
  }
}
