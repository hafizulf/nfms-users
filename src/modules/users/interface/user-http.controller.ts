import { Body, Controller, Get, Post } from "@nestjs/common";
import { UserRpcService } from "../application/services/user-rpc.service";
import { CreateUserRequest, UserResponseDto } from "./dto/user.dto";

@Controller('/users')
export class UserController {
  constructor(
    private readonly _userRpcService: UserRpcService,
  ) {}

  @Get()
  async findUsers() {
    const data = await this._userRpcService.findUsers();

    return {
      statusCode: 200,
      message: 'Users retrieved successfully',
      data,
    };
  }

  // @Post()
  // async storeUsers(
  //   @Body() request: CreateUserRequest
  // ): Promise<UserResponseDto> {
    
  // }
}
