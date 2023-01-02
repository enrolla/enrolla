import { FeaturesService } from '../features/features.service';
import { Feature } from '../features/entities/feature.entity';
import { PackageFeature } from './entities/package-feature.entity';
import { Parent, ResolveField } from '@nestjs/graphql';

export class FeatureInstancesResolver {
  constructor(private readonly featuresService: FeaturesService) {}

  @ResolveField(() => Feature)
  async feature(@Parent() packageFeature: PackageFeature) {
    const { featureId, tenantId } = packageFeature;

    return this.featuresService.findOne(featureId, tenantId);
  }
}
