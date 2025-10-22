import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ResetPasswordCommand } from "../command/reset-password.command";
import { UserEntity } from "../../infrastucture/persistence/entities/user.entity";
import { Inject } from "@nestjs/common";
import { SECURITY_TOKENS } from "src/modules/common/security/tokens";
import { PasswordHasher } from "src/modules/common/security/password-hasher.port";
import { REPOSITORY_TYPES } from "../../infrastucture/persistence/repositories/user-repository.types";
import { UserRepository } from "../../infrastucture/persistence/repositories/user-repository.interface";

@CommandHandler(ResetPasswordCommand)
export class ResetPasswordHandler 
implements ICommandHandler<ResetPasswordCommand, UserEntity | null> {
  constructor(
    @Inject(SECURITY_TOKENS.PASSWORD_HASHER) private readonly hasher: PasswordHasher,
    @Inject(REPOSITORY_TYPES.UserRepository) private readonly userRepository: UserRepository,
  ) {}

  async execute(command: ResetPasswordCommand): Promise<UserEntity | null> {
    const passwordHash = await this.hasher.hash(command.password);
    return await this.userRepository.resetPassword(command.user_id, passwordHash);
  }
}
