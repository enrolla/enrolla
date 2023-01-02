import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GraphQLJWTAuthGuard } from '../authz/graphql-jwt-auth.guard';
import { Package } from '../packages/entities/package.entity';
import { PackagesService } from '../packages/packages.service';
import { FeaturesService } from '../features/features.service';
import { PackageFeature } from './entities/package-feature.entity';
import { Feature } from '../features/entities/feature.entity';
import { FeatureInstance } from './entities/feature-instance.entity';

@Resolver(() => PackageFeature)
@UseGuards(GraphQLJWTAuthGuard)
export class PackageFeaturesResolver {
  constructor(
    private readonly packagesService: PackagesService,
    private readonly featuresService: FeaturesService
  ) {}

  @ResolveField(() => Feature)
  async feature(@Parent() packageFeature: PackageFeature) {
    console.log('featureInstance', packageFeature);
    const { featureId, tenantId } = packageFeature;

    return this.featuresService.findOne(featureId, tenantId);
  }

  @ResolveField(() => Package)
  async package(@Parent() packageFeature: PackageFeature) {
    const { packageId, tenantId } = packageFeature;

    return this.packagesService.findOne(packageId, tenantId);
  }
}
