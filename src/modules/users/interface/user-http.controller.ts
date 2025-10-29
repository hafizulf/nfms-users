import { 
  Body, 
  Controller, 
  Delete, 
  Get, 
  Logger, 
  Param, 
  Patch, 
  Post, 
  UploadedFile, 
  UseFilters, 
  UseInterceptors 
} from "@nestjs/common";
import { UserRpcService } from "../application/services/user-rpc.service";
import { CreateUserRequest, FindOneUserRequest, UpdateUserImageResponse, UpdateUserRequest, UserResponseDto } from "./dto/user.dto";
import { StandardResponseDto } from "../../common/dto/standard-response.dto";
import { UserService } from "../application/services/user.service";
import { FileUploadInterceptor } from "src/interceptors/file-upload.interceptor";
import type { File } from '@nest-lab/fastify-multer';
import { FileImagePipe } from "src/pipes/file-image.pipe";
import { GrpcToHttpFilter } from "src/filters/grpc-to-http.filter";

@Controller('/users')
@UseFilters(GrpcToHttpFilter)
export class UserHttpController {
  private readonly logger: Logger;

  constructor(
    private readonly _userRpcService: UserRpcService,
    private readonly _userService: UserService,
  ) {
    this.logger = new Logger(UserHttpController.name);
  }

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

  @Patch(':id/image')
  @UseInterceptors(
    new FileUploadInterceptor({
      fieldName: 'image',
      maxSizeInMB: 1,
      allowedMimeTypes: ['image/jpeg', 'image/png'],
    }),
  )
  async updateUserImage(
    @Param() params: FindOneUserRequest,
    @UploadedFile(new FileImagePipe([ 'image/png', 'image/jpeg'], true)) image: File,
  ): Promise<StandardResponseDto<UpdateUserImageResponse>> {
    const user_id = params.id;
    const data = await this._userService.updateUserImage({
      user_id,
      image,
    });

    return {
      statusCode: 200,
      message: 'User image uploaded.',
      data,
    };
  }
}
