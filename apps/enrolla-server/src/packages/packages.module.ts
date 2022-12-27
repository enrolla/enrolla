import { Module } from '@nestjs/common';
import { PackagesService } from './packages.service';
import { PackagesController } from './packages.controller';
import { PrismaService } from '../prisma.service';
import { PackagesResolver } from './packages.resolver';

@Module({
  controllers: [PackagesController],
  providers: [PackagesResolver, PackagesService, PrismaService],
})
export class PackagesModule {}
