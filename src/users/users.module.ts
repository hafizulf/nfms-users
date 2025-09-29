import { Module } from '@nestjs/common';
import { UserRpcController } from './interface/user-rpc.controller';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GrpcLoggerInterceptor } from 'src/interceptors/grpc-logger.interceptor';
import { REPOSITORY_TYPES } from 'src/infrastucture/persistence/repositories/user-repository.types';
import { UserRepositoryMikro } from 'src/infrastucture/persistence/mikro/user-repository.mikro';
import { UserRpcService } from './application/services/user-rpc.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserOrmEntity } from 'src/infrastucture/persistence/mikro/user.orm-entity';
import { UserController } from './interface/user-http.controller';

@Module({
  imports: [MikroOrmModule.forFeature([UserOrmEntity])],
  controllers: [
    UserRpcController,
    UserController,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: GrpcLoggerInterceptor,
    },
    {
      provide: REPOSITORY_TYPES.UserRepository,
      useClass: UserRepositoryMikro,
    },
    UserRpcService,
  ],
})
export class UsersModule {}
