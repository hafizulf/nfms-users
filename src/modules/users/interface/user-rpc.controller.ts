import { Controller, UseInterceptors, UsePipes } from '@nestjs/common';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import { GrpcLoggerInterceptor } from 'src/interceptors/grpc-logger.interceptor';
import { FindOneUserRequest, FindOneUserResponse, FindUserByEmailRequest, FindUsersRequest, FindUsersResponse } from './dto/user.dto';
import { UserRpcService } from '../application/services/user-rpc.service';
import { MikroOrmGrpcContextInterceptor } from 'src/interceptors/mikro-orm-rpc-context.interceptor';
import { buildGrpcValidationPipe } from 'src/modules/common/validation/build-validation-pipe';

@Controller()
@UseInterceptors(GrpcLoggerInterceptor, MikroOrmGrpcContextInterceptor)
export class UserRpcController {
  constructor(private readonly userRpcService: UserRpcService) {}
  
  @GrpcMethod('UserService', 'FindUsers')
  async findUsers(
    @Payload() request: FindUsersRequest
  ): Promise<FindUsersResponse> {
    const users = await this.userRpcService.findUsers(request);
    return { users };
  }
  
  @GrpcMethod('UserService', 'FindOneUser')
  @UsePipes(buildGrpcValidationPipe())
  async findOneUser(
    @Payload() request: FindOneUserRequest
  ): Promise<FindOneUserResponse> {
    const user = await this.userRpcService.findOneUser(request);
    return { user };
  }

  @GrpcMethod('UserService', 'FindUserByEmail')
  @UsePipes(buildGrpcValidationPipe())
  async findUserByEmail(
    @Payload() request: FindUserByEmailRequest,
  ): Promise<FindOneUserResponse> {
    const user = await this.userRpcService.findUserByEmail(request);
    return { user };
  }
}
