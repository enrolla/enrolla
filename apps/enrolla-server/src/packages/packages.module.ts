import { Module } from '@nestjs/common';
import { PackagesService } from './packages.service';
import { PackagesController } from './packages.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [PackagesController],
  providers: [PackagesService, PrismaService],
})
export class PackagesModule {}
