import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import type { JWTPayload } from 'jose';
import { JwtVerifier } from './jwt.verify'

type RequestWithUser = FastifyRequest & { user?: JWTPayload };

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(private readonly verifier: JwtVerifier) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<FastifyRequest>();
    const auth = req.headers['authorization'] ?? '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';

    if (!token) throw new UnauthorizedException('Missing Bearer token');

    try {
      const payload = await this.verifier.verifyAccessToken(token);
      (req as RequestWithUser).user = payload;
      return true;
    } catch (err: any) {
      throw new UnauthorizedException(err?.message || 'Invalid or expired token');
    }
  }
}
