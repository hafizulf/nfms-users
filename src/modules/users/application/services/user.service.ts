import { Injectable } from "@nestjs/common";
import { CreateUserRequest, UserResponseDto } from "../../interface/dto/user.dto";
import { CommandBus } from "@nestjs/cqrs";
import { CreateUserCommand } from "../command/create-user.command";
import { UserViewMapper } from "../../interface/mapper/user-view.mapper";

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
}
