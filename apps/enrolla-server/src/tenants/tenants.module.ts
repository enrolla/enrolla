import { Module } from '@nestjs/common';
import { ApiTokenService } from './api-tokens/service';
import { TenantsResolver } from './tenants.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { EncryptionKeyService } from './encryption-keys/servce';

@Module({
  providers: [ApiTokenService, EncryptionKeyService, TenantsResolver],
  imports: [PrismaModule],
  exports: [ApiTokenService],
})
export class TenantsModule {}
