import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PasswordHasher } from './password-hasher.port';

@Injectable()
export class BcryptHasherService implements PasswordHasher {
  constructor(private readonly config: ConfigService) {}

  private get rounds(): number {
    return Number(this.config.get('BCRYPT_ROUNDS') ?? 12);
  }

  async hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, this.rounds);
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }
}
