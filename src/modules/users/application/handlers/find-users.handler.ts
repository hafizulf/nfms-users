import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { FindUsersQuery } from "../query/find-users.query";
import { UserEntity } from "../../infrastucture/persistence/entities/user.entity";
import { Inject } from "@nestjs/common";
import { REPOSITORY_TYPES } from "../../infrastucture/persistence/repositories/user-repository.types";
import { UserRepository } from "../../infrastucture/persistence/repositories/user-repository.interface";

@QueryHandler(FindUsersQuery)
export class FindUsersHandler 
implements IQueryHandler<FindUsersQuery, UserEntity[]> {
  constructor(
    @Inject(REPOSITORY_TYPES.UserRepository)
    private _userRepository: UserRepository,
  ) {}

  async execute(_query: FindUsersQuery): Promise<UserEntity[]> {
    const users = await this._userRepository.findAll();
    return users;
  }
}
