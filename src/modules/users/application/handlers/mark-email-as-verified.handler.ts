import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { MarkEmailAsVerifiedCommand } from "../command/mark-email-as-verified.command";
import { UserEntity } from "../../infrastucture/persistence/entities/user.entity";
import { Inject } from "@nestjs/common";
import { REPOSITORY_TYPES } from "../../infrastucture/persistence/repositories/user-repository.types";
import { UserRepository } from "../../infrastucture/persistence/repositories/user-repository.interface";

@CommandHandler(MarkEmailAsVerifiedCommand)
export class MarkEmailAsVerifiedHandler 
implements ICommandHandler<MarkEmailAsVerifiedCommand, UserEntity | null> {
  constructor(
    @Inject(REPOSITORY_TYPES.UserRepository)
    private readonly _userRepository: UserRepository,
  ) {}

  async execute(command: MarkEmailAsVerifiedCommand): Promise<UserEntity | null> {
    return await this._userRepository.markEmailAsVerified(command.email);
  }
}
