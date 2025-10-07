import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { FindUserByEmailQuery } from "../query/find-user-by-email.query";
import { UserEntity } from "../../infrastucture/persistence/entities/user.entity";
import { Inject } from "@nestjs/common";
import { REPOSITORY_TYPES } from "../../infrastucture/persistence/repositories/user-repository.types";
import { UserRepository } from "../../infrastucture/persistence/repositories/user-repository.interface";

@QueryHandler(FindUserByEmailQuery)
export class FindUserByEmailHandler 
implements IQueryHandler<FindUserByEmailQuery, UserEntity | null> {
  constructor(
    @Inject(REPOSITORY_TYPES.UserRepository)
    private readonly _userRepository: UserRepository,
  ) {}

  async execute(query: FindUserByEmailQuery): Promise<UserEntity | null> {
    return (await this._userRepository.findByEmail(query.email));
  }
}