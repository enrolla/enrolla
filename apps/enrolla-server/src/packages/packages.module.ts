import { Module } from '@nestjs/common';
import { PackagesService } from './packages.service';
import { PackagesController } from './packages.controller';
import { PrismaService } from '../prisma.service';
import { PackagesResolver } from './packages.resolver';
import { FeatureInstancesService } from '../feature-instances/feature-instances.service';

@Module({
  controllers: [PackagesController],
  providers: [
    PackagesResolver,
    PackagesService,
    PrismaService,
    FeatureInstancesService,
  ],
})
export class PackagesModule {}
