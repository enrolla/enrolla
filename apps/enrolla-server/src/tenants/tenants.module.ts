import { Module } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { TenantsResolver } from './tenants.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [TenantsService, TenantsResolver],
  imports: [PrismaModule],
  exports: [TenantsService],
})
export class TenantsModule {}
