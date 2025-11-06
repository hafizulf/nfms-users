import { ConfigService } from "@nestjs/config";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { AppError } from "../errors/app-error";
import { Injectable } from "@nestjs/common";

@Injectable()
export class JwtVerifier {
  private JWKS: ReturnType<typeof createRemoteJWKSet>;
  private issuer: string;
  private audience: string;

  constructor(private readonly config: ConfigService) {
    this.issuer = this.config.get('JWT_ISSUER')!;
    this.audience = this.config.get('JWT_AUDIENCE')!;
    this.JWKS = createRemoteJWKSet(new URL(this.config.get('JWKS_URI')!));
  }

  async verifyAccessToken(token: string) {
    const { payload, protectedHeader } = await jwtVerify(token, this.JWKS, {
      issuer: this.issuer,
      audience: this.audience,
      clockTolerance: 60,
    });

    if(protectedHeader.alg !== 'RS256') throw new AppError('401', 'Invalid algorithm');
    if(!protectedHeader.kid) throw new AppError('401', 'Missing kid');

    return payload;
  }
}
