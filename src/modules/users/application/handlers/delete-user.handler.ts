import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteUserCommand } from "../command/delete-user.command";
import { Inject } from "@nestjs/common";
import { REPOSITORY_TYPES } from "../../infrastucture/persistence/repositories/user-repository.types";
import { UserRepository } from "../../infrastucture/persistence/repositories/user-repository.interface";

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler 
implements ICommandHandler<DeleteUserCommand, boolean> {
  constructor(
    @Inject(REPOSITORY_TYPES.UserRepository) private _userRepository: UserRepository,
  ) {}

  async execute(command: DeleteUserCommand): Promise<boolean> {
    return await (this._userRepository.softDelete(command.id));
  }
}
