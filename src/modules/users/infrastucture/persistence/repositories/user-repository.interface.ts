import { UserEntity } from "../entities/user.entity";

export abstract class UserRepository {
  abstract findAll(): Promise<UserEntity[]>;
  abstract save(user: UserEntity): Promise<UserEntity>;
}
