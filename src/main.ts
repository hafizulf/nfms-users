import { NestFactory } from '@nestjs/core';
import { NestFastifyApplication, FastifyAdapter } from '@nestjs/platform-fastify';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';import { buildHttpValidationPipe } from './modules/common/validation/build-validation-pipe';
import { AppErrorHttpFilter } from './filters/app-error-http.filter';
async function bootstrap() {
  // Create main Fastify HTTP app
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  const configService = app.get(ConfigService);
  const appPort = configService.get<number>('APP_PORT') || 3001;
  const grpcUrl = configService.get<string>('GRPC_URL');

  // Attach gRPC microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'user',
      protoPath: join(__dirname, './proto/user/user.proto'),
      url: grpcUrl,
    },
  });

  // Apply global validation pipe to HTTP and gRPC
  app.useGlobalPipes(buildHttpValidationPipe());
  app.useGlobalFilters(new AppErrorHttpFilter());

  // Start both HTTP + Microservice
  await app.startAllMicroservices();
  await app.listen(appPort);

  console.log(`Microservice is running on: ${grpcUrl}`);
  console.log('Application is running on port:', appPort);
}
bootstrap();
