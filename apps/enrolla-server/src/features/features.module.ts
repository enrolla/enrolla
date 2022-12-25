import { Module } from '@nestjs/common';
import { FeaturesService } from './features.service';
import { FeaturesController } from './features.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [FeaturesController],
  providers: [FeaturesService, PrismaService]
})
export class FeaturesModule {}
