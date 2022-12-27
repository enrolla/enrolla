import { Module } from '@nestjs/common';
import { FeatureInstancesService } from './feature-instances.service';
import { FeatureInstancesResolver } from './feature-instances.resolver';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [FeatureInstancesResolver, FeatureInstancesService, PrismaService],
})
export class FeatureInstancesModule {}
