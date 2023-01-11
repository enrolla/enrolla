import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { PropelAuthStrategy } from './propelauth.strategy';
import { TenantsModule } from '../tenants/tenants.module';

@Module({
  imports: [
    TenantsModule,
    PassportModule.register({ defaultStrategy: 'PropelAuth' }),
  ],
  providers: [PropelAuthStrategy],
  exports: [PassportModule],
})
export class AuthzModule {}
