import { UserEntity } from "../entities/user.entity";

export abstract class UserRepository {
  abstract findAll(): Promise<UserEntity[]>;
  abstract save(user: UserEntity): Promise<UserEntity>;
  abstract findById(id: string): Promise<UserEntity | null>;
  abstract update(id: string, user: Partial<UserEntity>): Promise<UserEntity | null>;
  abstract softDelete(id: string): Promise<boolean>;
  abstract findByEmail(email: string): Promise<UserEntity | null>;
  abstract markEmailAsVerified(email: string): Promise<UserEntity | null>;
  abstract resetPassword(user_id: string, passwordHash: string): Promise<UserEntity | null>;
}
