import { Module } from "@nestjs/common";
import { GrpcClientHelper } from "src/helpers/grpc-client.helper";
import { JwtVerifier } from "./auth/jwt.verify";

@Module({
  providers: [GrpcClientHelper, JwtVerifier],
  exports: [GrpcClientHelper],
})
export class CommonModule {}
