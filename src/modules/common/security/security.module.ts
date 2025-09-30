import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BcryptHasherService } from './bcrypt-hasher.service';
import { SECURITY_TOKENS } from './tokens';

@Module({
  imports: [ConfigModule],
  providers: [
    { 
      provide: SECURITY_TOKENS.PASSWORD_HASHER, 
      useClass: BcryptHasherService 
    },
  ],
  exports: [SECURITY_TOKENS.PASSWORD_HASHER],
})
export class SecurityModule {}
