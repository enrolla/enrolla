import { Resolver, Query, Args, ResolveField, Parent } from '@nestjs/graphql';
import { FeatureInstancesService } from './feature-instances.service';
import { FeatureInstance } from './entities/feature-instance.entity';
import { TenantId } from '../authz/tenant.decorator';
import { UseGuards } from '@nestjs/common';
import { GraphQLJWTAuthGuard } from '../authz/graphql-jwt-auth.guard';
import { Package } from '../packages/entities/package.entity';
import { PackagesService } from '../packages/packages.service';
import { FeaturesService } from '../features/features.service';

@Resolver(() => FeatureInstance)
@UseGuards(GraphQLJWTAuthGuard)
export class FeatureInstancesResolver {
  constructor(
    private readonly featureInstancesService: FeatureInstancesService,
    private readonly packagesService: PackagesService,
    private readonly featuresService: FeaturesService
  ) {}

  @Query(() => [FeatureInstance], { name: 'featureInstances' })
  async findAll(@TenantId() tenantId: string) {
    return await this.featureInstancesService.findAll(tenantId);
  }

  @Query(() => FeatureInstance, { name: 'featureInstance' })
  async findOne(
    @TenantId() tenantId: string,
    @Args('id', { type: () => String }) id: string
  ) {
    return await this.featureInstancesService.findOne(id, tenantId);
  }

  @ResolveField(() => Package)
  async package(@Parent() featureInstance: FeatureInstance) {
    const { packageId, tenantId } = featureInstance;

    return this.packagesService.findOne(packageId, tenantId);
  }

  @ResolveField(() => Package)
  async feature(@Parent() featureInstance: FeatureInstance) {
    const { featureId, tenantId } = featureInstance;

    return this.featuresService.findOne(featureId, tenantId);
  }
}
