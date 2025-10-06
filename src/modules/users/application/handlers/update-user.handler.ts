import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateUserCommand } from "../command/update-user.command";
import { UserEntity } from "../../infrastucture/persistence/entities/user.entity";
import { Inject } from "@nestjs/common";
import { REPOSITORY_TYPES } from "../../infrastucture/persistence/repositories/user-repository.types";
import { UserRepository } from "../../infrastucture/persistence/repositories/user-repository.interface";

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler 
implements ICommandHandler<UpdateUserCommand, UserEntity | null> {
  constructor(
    @Inject(REPOSITORY_TYPES.UserRepository)
    private readonly _userRepository: UserRepository,
  ) {}

  async execute(command: UpdateUserCommand): Promise<UserEntity | null> {
    const { id, ...userData } = command.userData;
    return await this._userRepository.update(id, userData);
  }
}
