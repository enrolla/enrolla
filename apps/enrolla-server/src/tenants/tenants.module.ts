import { Module } from '@nestjs/common';
import { GithubService } from '../github/github.service';
import { PrismaService } from '../prisma.service';
import { TenantsController } from './tenants.controller';
import { TenantsService } from './tenants.service';

@Module({
  controllers: [TenantsController],
  providers: [TenantsService, GithubService, PrismaService],
})
export class TenantsModule {}
