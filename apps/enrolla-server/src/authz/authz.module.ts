import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { PropelAuthStrategy } from './propelauth.strategy';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'PropelAuth' })],
  providers: [PropelAuthStrategy],
  exports: [PassportModule],
})
export class AuthzModule {}
