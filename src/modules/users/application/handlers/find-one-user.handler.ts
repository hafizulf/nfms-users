import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { FindOneUserQuery } from "../query/find-one-user.query";
import { UserEntity } from "../../infrastucture/persistence/entities/user.entity";
import { Inject } from "@nestjs/common";
import { REPOSITORY_TYPES } from "../../infrastucture/persistence/repositories/user-repository.types";
import { UserRepository } from "../../infrastucture/persistence/repositories/user-repository.interface";

@QueryHandler(FindOneUserQuery)
export class FindOneUserHandler 
implements IQueryHandler<FindOneUserQuery, UserEntity | null> {
  constructor(
    @Inject(REPOSITORY_TYPES.UserRepository)
    private readonly _userRepository: UserRepository,
  ) {}

  async execute(query: FindOneUserQuery): Promise<UserEntity | null> {
    const user = await this._userRepository.findById(query.id);
    return user;
  }
}
