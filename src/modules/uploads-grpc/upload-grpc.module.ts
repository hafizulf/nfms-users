import { Module } from "@nestjs/common";
import { CommonModule } from "../common/common.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { join } from "path";
import { UploadGrpcService } from "./upload-grpc.service";

@Module({
  imports: [
    CommonModule,
    ClientsModule.registerAsync([
      {
        name: 'UPLOADS_GRPC',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            url: configService.get<string>('UPLOADS_GRPC_URL'),
            package: 'upload',
            protoPath: join(__dirname, '../../proto/upload/upload.proto'),
            loader: {
              keepCase: true,
            }
          }
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [UploadGrpcService],
  exports: [
    ClientsModule,
    UploadGrpcService,
  ],
})
export class UploadsGrpcModule {}
