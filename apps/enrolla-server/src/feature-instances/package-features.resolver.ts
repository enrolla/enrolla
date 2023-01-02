import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GraphQLJWTAuthGuard } from '../authz/graphql-jwt-auth.guard';
import { Package } from '../packages/entities/package.entity';
import { PackagesService } from '../packages/packages.service';
import { FeaturesService } from '../features/features.service';
import { PackageFeature } from './entities/package-feature.entity';
import { FeatureInstancesResolver } from './feature-instances.resolver';

@Resolver(() => PackageFeature)
@UseGuards(GraphQLJWTAuthGuard)
export class PackageFeaturesResolver extends FeatureInstancesResolver {
  constructor(
    private readonly packagesService: PackagesService,
    featuresService: FeaturesService
  ) {
    super(featuresService);
  }

  @ResolveField(() => Package)
  async package(@Parent() packageFeature: PackageFeature) {
    const { packageId, tenantId } = packageFeature;

    return this.packagesService.findOne(packageId, tenantId);
  }
}
