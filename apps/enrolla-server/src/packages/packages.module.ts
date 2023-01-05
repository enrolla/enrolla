import { Module } from '@nestjs/common';
import { PackagesService } from './packages.service';
import { PackagesController } from './packages.controller';
import { PackagesResolver } from './packages.resolver';
import { FeaturesModule } from '../features/features.module';
import { FeatureInstancesModule } from '../feature-instances/feature-instances.module';

@Module({
  controllers: [PackagesController],
  providers: [PackagesResolver, PackagesService],
  imports: [FeaturesModule, FeatureInstancesModule],
  exports: [PackagesService],
})
export class PackagesModule {}
