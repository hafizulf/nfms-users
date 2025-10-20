import { Inject, Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UserEntity } from 'src/modules/users/infrastucture/persistence/entities/user.entity';
import { FindOneUserRequest, FindUserByEmailRequest, FindUsersRequest, Sub, UserResponseDto, VerifyCredentialsRequest } from "src/modules/users/interface/dto/user.dto";
import { FindUsersQuery } from '../query/find-users.query';
import { UserViewMapper } from '../../interface/mapper/user-view.mapper';
import { FindOneUserQuery } from '../query/find-one-user.query';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { FindUserByEmailQuery } from '../query/find-user-by-email.query';
import { SECURITY_TOKENS } from 'src/modules/common/security/tokens';
import { PasswordHasher } from 'src/modules/common/security/password-hasher.port';
import { UserNotFoundError } from '../errors/user.error';
import { MarkEmailAsVerifiedCommand } from '../command/mark-email-as-verified.command';

@Injectable()
export class UserRpcService {
  constructor(
    private readonly _queryBus: QueryBus,
    private readonly _commandBus: CommandBus,
    @Inject(SECURITY_TOKENS.PASSWORD_HASHER) private readonly hasher: PasswordHasher,
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

    if (!user) throw new RpcException({ code: status.NOT_FOUND, details: 'User not found' });

    return UserViewMapper.toResponseDto(user);
  }

  async findUserByEmail(params: FindUserByEmailRequest): Promise<UserResponseDto> {
    const user: UserEntity = await this._queryBus.execute(
      new FindUserByEmailQuery(params.email),
    )

    if (!user) throw new RpcException({ code: status.NOT_FOUND, details: 'User not found' });

    return UserViewMapper.toResponseDto(user);
  }

  async verifyCredentials(
    payload: VerifyCredentialsRequest
  ): Promise<Sub> {
    const user: UserEntity = await this._queryBus.execute(
      new FindUserByEmailQuery(payload.email),
    )
    if (!user) throw new RpcException({ code: status.NOT_FOUND, details: 'User not found' });

    const matched = await this.hasher.compare(payload.password, user.passwordHash);
    if (!matched) throw new RpcException({ code: status.UNAUTHENTICATED, details: 'Invalid password' });
    if(!user.is_email_verified) throw new RpcException({ code: status.UNAUTHENTICATED, details: 'Email not verified' });

    return { sub: user.id };
  }

  async markEmailAsVerified(user_id: string): Promise<UserResponseDto> {
    const user = await this._queryBus.execute(
      new FindOneUserQuery(user_id),
    )

    if(!user) throw new UserNotFoundError(user_id);

    const updated = await this._commandBus.execute(
      new MarkEmailAsVerifiedCommand(user._email),
    );

    return UserViewMapper.toResponseDto(updated);
  }
}
