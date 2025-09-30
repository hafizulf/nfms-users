import { Controller, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { GrpcLoggerInterceptor } from 'src/interceptors/grpc-logger.interceptor';
import { FindUsersRequest, FindUsersResponse } from './dto/user.dto';
import { UserRpcService } from '../application/services/user-rpc.service';
import { MikroOrmGrpcContextInterceptor } from 'src/interceptors/mikro-orm-rpc-context.interceptor';

@Controller()
@UseInterceptors(GrpcLoggerInterceptor, MikroOrmGrpcContextInterceptor)
export class UserRpcController {
  constructor(private readonly userRpcService: UserRpcService) {}

  @GrpcMethod('UserService', 'FindUsers')
  async findUsers(request: FindUsersRequest): Promise<FindUsersResponse> {
    const users = await this.userRpcService.findUsers(request);
    return { users };
  }
}
