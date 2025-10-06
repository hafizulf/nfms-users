import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { UserRpcService } from "../application/services/user-rpc.service";
import { CreateUserRequest, FindOneUserRequest, UpdateUserRequest, UserResponseDto } from "./dto/user.dto";
import { StandardResponseDto } from "../../common/dto/standard-response.dto";
import { UserService } from "../application/services/user.service";

@Controller('/users')
export class UserHttpController {
  constructor(
    private readonly _userRpcService: UserRpcService,
    private readonly _userService: UserService,
  ) {}

  @Get()
  async findUsers(): Promise<StandardResponseDto<UserResponseDto[]>> {
    const data = await this._userRpcService.findUsers({});

    return {
      statusCode: 200,
      message: 'Users retrieved successfully',
      data,
    };
  }

  @Post()
  async storeUsers(
    @Body() request: CreateUserRequest
  ): Promise<StandardResponseDto<UserResponseDto>> {

    const data = await this._userService.createUser(request);
    
    return {
      statusCode: 201,
      message: 'User created successfully',
      data,
    }
  }

  @Get(":id")
  async findUser(
    @Param() param: FindOneUserRequest,
  ): Promise<StandardResponseDto<UserResponseDto>> {
    const data = await this._userRpcService.findOneUser({ id: param.id });
    
    return {
      statusCode: 200,
      message: 'User retrieved successfully',
      data,
    }
  }

  @Patch(":id")
  async updateUser(
    @Param() params: FindOneUserRequest,
    @Body() request: UpdateUserRequest
  ): Promise<StandardResponseDto<UserResponseDto>> {
    const data = await this._userService.updateUser(params, request);
    
    return {
      statusCode: 200,
      message: 'User updated successfully',
      data,
    }
  }

  @Delete(":id")
  async deleteUser(
    @Param() params: FindOneUserRequest,
  ): Promise<StandardResponseDto<boolean>> {
    await this._userService.deleteUser(params);
    
    return {
      statusCode: 200,
      message: 'User deleted successfully',
    } 
  }
}
