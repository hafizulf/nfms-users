import { Inject, Injectable } from "@nestjs/common";
import { UserRepository } from "src/infrastucture/persistence/repositories/user-repository.interface";
import { REPOSITORY_TYPES } from "src/infrastucture/persistence/repositories/user-repository.types";
import { CreateUserRequest } from "../../interface/dto/user.dto";

@Injectable()
export class UserService {
  constructor(
    @Inject(REPOSITORY_TYPES.UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async createUser(
    params: CreateUserRequest,
  ): Promise<any> {
    console.log("params...", params);

    return {
      statusCode: 200,
      message: 'User created successfully',
    };
  }
}