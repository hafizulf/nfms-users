import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { buildValidationPipe } from './modules/common/validation/build-validation-pipe';

async function bootstrap() {
  // Create main Fastify HTTP app
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );

  const configService = app.get(ConfigService);
  const appPort = configService.get<number>('APP_PORT') || 3001;
  const grpcUrl = configService.get<string>('GRPC_URL');

  // Attach gRPC microservice
  const grpc = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'user',
      protoPath: join(__dirname, './proto/user/user.proto'),
      url: grpcUrl,
    },
  });

  // Apply global validation pipe to HTTP and gRPC
  app.useGlobalPipes(buildValidationPipe('http'));
  grpc.useGlobalPipes(buildValidationPipe('rpc'));

  // Start both HTTP + Microservice
  await app.startAllMicroservices();
  await app.listen(appPort);

  console.log(`Microservice is running on: ${grpcUrl}`);
  console.log('Application is running on port:', appPort);
}
bootstrap();
