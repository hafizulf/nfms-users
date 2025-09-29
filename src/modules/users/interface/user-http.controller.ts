import { Body, Controller, Get, Post } from "@nestjs/common";
import { UserRpcService } from "../application/services/user-rpc.service";
import { CreateUserRequest, UserResponseDto } from "./dto/user.dto";
import { StandardResponseDto } from "../../common/dto/standard-response.dto";
import { UserService } from "../application/services/user.service";

@Controller('/users')
export class UserController {
  constructor(
    private readonly _userRpcService: UserRpcService,
    private readonly _userService: UserService,
  ) {}

  @Get()
  async findUsers(): Promise<StandardResponseDto<UserResponseDto[]>> {
    const data = await this._userRpcService.findUsers();

    return {
      statusCode: 200,
      message: 'Users retrieved successfully',
      data,
    };
  }

  @Post()
  async storeUsers(
    @Body() request: CreateUserRequest
  // ): Promise<StandardResponseDto<UserResponseDto>> {
  ): Promise<any> {

    const data = await this._userService.createUser(request);
    
    return {
      statusCode: 201,
      message: 'User created successfully',
    }
  }
}
