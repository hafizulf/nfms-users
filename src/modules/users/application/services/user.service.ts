import { Injectable } from "@nestjs/common";
import { CreateUserRequest, FindOneUserRequest, UpdateUserRequest, UserResponseDto } from "../../interface/dto/user.dto";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreateUserCommand } from "../command/create-user.command";
import { UserViewMapper } from "../../interface/mapper/user-view.mapper";
import { UserNotFoundError } from "../errors/user.error";
import { FindOneUserQuery } from "../query/find-one-user.query";
import { UpdateUserCommand } from "../command/update-user.command";

@Injectable()
export class UserService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async createUser(
    body: CreateUserRequest,
  ): Promise<UserResponseDto> {
    const createdUser = await this.commandBus.execute(
      new CreateUserCommand(body),
    );

    return UserViewMapper.toResponseDto(createdUser);
  }

  async updateUser(
    params: FindOneUserRequest,
    body: UpdateUserRequest,
  ): Promise<UserResponseDto> {
    const updated = await this.commandBus.execute(
      new UpdateUserCommand({ id: params.id, ...body })
    );

    if (!updated) throw new UserNotFoundError(params.id);

    return UserViewMapper.toResponseDto(updated);
  }
}
