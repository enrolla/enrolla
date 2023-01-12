import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt-auth.strategy';
import { TenantsModule } from '../tenants/tenants.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'JwtAuth' }),
    TenantsModule,
  ],
  providers: [JwtStrategy],
  exports: [PassportModule],
})
export class AuthzModule {}
