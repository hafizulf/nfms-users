import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { mikroOrmConfig } from './config/mikro-orm.config';
import { EnvValidationSchema, formatEnvErrors } from './config/env-validation.config';
import { MikroOrmContextInterceptor } from './interceptors/mikro-orm-context.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationOptions: {
        strict: true,
        abortEarly: false,
      },
      validate: (config) => {
        const result = EnvValidationSchema.safeParse(config);
        if (!result.success) {
          throw new Error(JSON.stringify(formatEnvErrors(result.error)));
        }
        return result.data;
      },
    }),
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => mikroOrmConfig(config),
      inject: [ConfigService],
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: MikroOrmContextInterceptor,
    },
  ],
})
export class AppModule {}
