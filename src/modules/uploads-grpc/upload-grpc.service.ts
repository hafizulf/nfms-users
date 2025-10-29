import { Observable } from "rxjs";
import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import type { ClientGrpc } from "@nestjs/microservices";
import { GrpcClientHelper } from "src/helpers/grpc-client.helper";
import { UploadUserImageRequest, UploadUserImageResponse } from "./upload-grpc.dto";

interface uploadServiceClient {
  UploadUserImage(data: UploadUserImageRequest): Observable<UploadUserImageResponse>
}

@Injectable()
export class UploadGrpcService implements OnModuleInit {
  private uploads!: uploadServiceClient;
  private uploadServiceName: string = 'Upload Service';

  constructor(
    @Inject('UPLOADS_GRPC') private readonly _client: ClientGrpc,
    private readonly grpc: GrpcClientHelper,
  ) {}

  onModuleInit() {
    this.uploads = this._client.getService<uploadServiceClient>('UploadService');
  }

  async uploadUserImage(data: UploadUserImageRequest): Promise<UploadUserImageResponse> {
    return this.grpc.call(this.uploadServiceName, this.uploads.UploadUserImage(data));
  }
}
