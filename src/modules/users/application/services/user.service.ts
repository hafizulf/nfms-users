import { Injectable } from "@nestjs/common";
import { CreateUserRequest, FindOneUserRequest, UpdateUserRequest, UserResponseDto } from "../../interface/dto/user.dto";
import { CommandBus } from "@nestjs/cqrs";
import { CreateUserCommand } from "../command/create-user.command";
import { UserViewMapper } from "../../interface/mapper/user-view.mapper";
import { UserNotFoundError } from "../errors/user.error";
import { UpdateUserCommand } from "../command/update-user.command";
import { DeleteUserCommand } from "../command/delete-user.command";

@Injectable()
export class UserService {
  constructor(
    private readonly commandBus: CommandBus,
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

  async deleteUser(
    params: FindOneUserRequest,
  ): Promise<void> {
    const deleted =await this.commandBus.execute(
      new DeleteUserCommand(params.id),
    );

    if (!deleted) throw new UserNotFoundError(params.id);

    return;
  }
}
