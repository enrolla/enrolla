import { Module } from '@nestjs/common';
import { FeatureInstancesService } from './feature-instances.service';
import { FeatureValuesResolver } from './resolvers/feature-values.resolver';
import { FeaturesModule } from '../features/features.module';

@Module({
  providers: [FeatureInstancesService, FeatureValuesResolver],
  imports: [FeaturesModule],
  exports: [FeatureInstancesService],
})
export class FeatureInstancesModule {}
