import { Controller, UseInterceptors, UsePipes } from '@nestjs/common';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import { GrpcLoggerInterceptor } from 'src/interceptors/grpc-logger.interceptor';
import { 
  CreateUserRequest, 
  FindOneUserRequest, 
  FindOneUserResponse, 
  FindUserByEmailRequest, 
  FindUserByEmailResponse, 
  FindUsersRequest, 
  FindUsersResponse, 
  MarkEmailAsVerifiedRequest, 
  ResetPasswordRequest, 
  VerifyCredentialsRequest, 
  VerifyCredentialsResponse 
} from './dto/user.dto';
import { UserRpcService } from '../application/services/user-rpc.service';
import { MikroOrmGrpcContextInterceptor } from 'src/interceptors/mikro-orm-rpc-context.interceptor';
import { buildGrpcValidationPipe } from 'src/modules/common/validation/build-validation-pipe';
import { UserService } from '../application/services/user.service';
import { GrpcAppErrorInterceptor } from 'src/interceptors/grpc-app-error.interceptor';

@Controller()
@UseInterceptors(
  GrpcLoggerInterceptor,
  MikroOrmGrpcContextInterceptor,
  GrpcAppErrorInterceptor,
)
export class UserRpcController {
  constructor(
    private readonly userRpcService: UserRpcService,
    private readonly userService: UserService,
  ) {}
  
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

  @GrpcMethod('UserService', 'VerifyCredentials')
  @UsePipes(buildGrpcValidationPipe())
  async verifyCredentials(
    @Payload() request: VerifyCredentialsRequest,
  ): Promise<VerifyCredentialsResponse> {
    const user = await this.userRpcService.verifyCredentials(request);
    return { user };
  }

  @GrpcMethod('UserService', 'RegisterUser')
  @UsePipes(buildGrpcValidationPipe())
  async registerUser(
    @Payload() request: CreateUserRequest,
  ): Promise<FindOneUserResponse> {
    const user = await this.userService.createUser(request);
    return { user };
  }

  @GrpcMethod('UserService', 'MarkEmailAsVerified')
  @UsePipes(buildGrpcValidationPipe())
  async markEmailAsVerified(
    @Payload() payload: MarkEmailAsVerifiedRequest,
  ): Promise<FindOneUserResponse> {
    const user = await this.userRpcService.markEmailAsVerified(payload.user_id);
    return { user };
  }

  @GrpcMethod('UserService', 'ResetPassword')
  @UsePipes(buildGrpcValidationPipe())
  async resetPassword(
    @Payload() payload: ResetPasswordRequest,
  ): Promise<FindUserByEmailResponse> {
    const user = await this.userRpcService.resetPassword(payload);
    return { user };
  }
}
