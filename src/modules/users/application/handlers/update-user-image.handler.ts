import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateUserImageCommand } from "../command/update-user-image.command";
import { Inject } from "@nestjs/common";
import { REPOSITORY_TYPES } from "../../infrastucture/persistence/repositories/user-repository.types";
import { UserRepository } from "../../infrastucture/persistence/repositories/user-repository.interface";

@CommandHandler(UpdateUserImageCommand)
export class UpdateUserImageHandler 
implements ICommandHandler<UpdateUserImageCommand, void> {
  constructor(
    @Inject(REPOSITORY_TYPES.UserRepository) private _userRepository: UserRepository,
  ) {}

  async execute(command: UpdateUserImageCommand): Promise<void> {
    const { user_id, avatar_path } = command;
    return await this._userRepository.updateAvatarPath(user_id, avatar_path);
  }
}
