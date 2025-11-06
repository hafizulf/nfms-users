import { Module } from '@nestjs/common';
import { UserRpcController } from './interface/user-rpc.controller';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { GrpcLoggerInterceptor } from 'src/interceptors/grpc-logger.interceptor';
import { REPOSITORY_TYPES } from 'src/modules/users/infrastucture/persistence/repositories/user-repository.types';
import { UserRepositoryMikro } from 'src/modules/users/infrastucture/persistence/mikro/user-repository.mikro';
import { UserRpcService } from './application/services/user-rpc.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserOrmEntity } from 'src/modules/users/infrastucture/persistence/mikro/user.orm-entity';
import { UserHttpController } from './interface/user-http.controller';
import { UserService } from './application/services/user.service';
import { UserHandlers } from './application/handlers';
import { CqrsModule } from '@nestjs/cqrs';
import { SecurityModule } from '../common/security/security.module';
import { UploadsGrpcModule } from '../uploads-grpc/upload-grpc.module';
import { CommonModule } from '../common/common.module';
import { JwtVerifier } from '../common/auth/jwt.verify';
import { AccessTokenGuard } from '../common/auth/access-token.guard';

@Module({
  imports: [
    MikroOrmModule.forFeature([UserOrmEntity]),
    SecurityModule,
    CqrsModule,
    UploadsGrpcModule,
    CommonModule,
  ],
  controllers: [
    UserRpcController,
    UserHttpController,
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
    ...UserHandlers,
    UserRpcService,
    UserService,
    JwtVerifier,
    {
      provide: APP_GUARD, 
      useClass: AccessTokenGuard,
    }
  ],
})
export class UsersModule {}
