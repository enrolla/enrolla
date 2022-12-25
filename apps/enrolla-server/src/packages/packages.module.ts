import { Module } from '@nestjs/common';
import { PackagesService } from './packages.service';
import { PackagesController } from './packages.controller';
import { PrismaService } from '../prisma.service';
import { FeaturesService } from '../features/features.service';

@Module({
  controllers: [PackagesController],
  providers: [PackagesService, PrismaService, FeaturesService],
})
export class PackagesModule {}
