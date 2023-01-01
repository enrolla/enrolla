import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { FeatureInstancesService } from './feature-instances.service';
import { FeatureInstance } from './entities/feature-instance.entity';
import { UseGuards } from '@nestjs/common';
import { GraphQLJWTAuthGuard } from '../authz/graphql-jwt-auth.guard';
import { Package } from '../packages/entities/package.entity';
import { PackagesService } from '../packages/packages.service';
import { FeaturesService } from '../features/features.service';
import { Feature } from '../features/entities/feature.entity';
import { Customer } from '../customers/entities/customer.entity';
import { CustomersService } from '../customers/customers.service';

@Resolver(() => FeatureInstance)
@UseGuards(GraphQLJWTAuthGuard)
export class FeatureInstancesResolver {
  constructor(
    private readonly featureInstancesService: FeatureInstancesService,
    private readonly packagesService: PackagesService,
    private readonly featuresService: FeaturesService,
    private readonly customersService: CustomersService
  ) {}

  @ResolveField(() => Package)
  async package(@Parent() featureInstance: FeatureInstance) {
    const { packageId, tenantId } = featureInstance;

    return this.packagesService.findOne(packageId, tenantId);
  }

  @ResolveField(() => Feature)
  async feature(@Parent() featureInstance: FeatureInstance) {
    const { featureId, tenantId } = featureInstance;

    return this.featuresService.findOne(featureId, tenantId);
  }

  @ResolveField(() => Customer)
  async customer(@Parent() featureInstance: FeatureInstance) {
    const { featureId, tenantId } = featureInstance;

    return this.customersService.findOne(featureId, tenantId);
  }
}
