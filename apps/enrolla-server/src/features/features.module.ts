import { Module } from '@nestjs/common';
import { FeaturesService } from './features.service';
import { FeaturesController } from './features.controller';
import { PrismaService } from '../prisma.service';
import { FeaturesResolver } from './features.resolver';

@Module({
  controllers: [FeaturesController],
  providers: [FeaturesResolver, FeaturesService, PrismaService],
  exports: [FeaturesService],
})
export class FeaturesModule {}
