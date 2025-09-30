import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateUserCommand } from "../command/create-user.command";
import { UserEntity } from "../../infrastucture/persistence/entities/user.entity";
import { Inject } from "@nestjs/common";
import { REPOSITORY_TYPES } from "../../infrastucture/persistence/repositories/user-repository.types";
import { UserRepository } from "../../infrastucture/persistence/repositories/user-repository.interface";
import { uuidv7 } from "uuidv7";
import { SECURITY_TOKENS } from "src/modules/common/security/tokens";
import { PasswordHasher } from "src/modules/common/security/password-hasher.port";

@CommandHandler(CreateUserCommand)
export class CreateUserHandler 
implements ICommandHandler<CreateUserCommand, UserEntity> {
  constructor(
    @Inject(SECURITY_TOKENS.PASSWORD_HASHER)
    private readonly hasher: PasswordHasher,
    @Inject(REPOSITORY_TYPES.UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(command: CreateUserCommand): Promise<UserEntity> {
    const uuid = uuidv7();
    const {
      name,
      email,
      password,
    } = command.userData;
    const passwordHash = await this.hasher.hash(password);
    const user = UserEntity.create(
      uuid, 
      name, 
      email, 
      passwordHash,
    );

    const saved = await this.userRepository.save(user);
    return saved; 
  }
}
