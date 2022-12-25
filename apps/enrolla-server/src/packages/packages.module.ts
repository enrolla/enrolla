import { Module } from '@nestjs/common';
import { PackagesService } from './packages.service';
import { PackagesController } from './packages.controller';

@Module({
  controllers: [PackagesController],
  providers: [PackagesService]
})
export class PackagesModule {}
