import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GraphQLJWTAuthGuard } from '../authz/graphql-jwt-auth.guard';
import { FeaturesService } from '../features/features.service';
import { Customer } from '../customers/entities/customer.entity';
import { CustomersService } from '../customers/customers.service';
import { CustomerFeature } from './entities/customer-feature.entity';
import { FeatureInstancesResolver } from './feature-instances.resolver';

@Resolver(() => CustomerFeature)
@UseGuards(GraphQLJWTAuthGuard)
export class PackageFeaturesResolver extends FeatureInstancesResolver {
  constructor(
    private readonly customersService: CustomersService,
    featuresService: FeaturesService
  ) {
    super(featuresService);
  }

  @ResolveField(() => Customer)
  async customer(@Parent() customerFeature: CustomerFeature) {
    const { featureId, tenantId } = customerFeature;

    return this.customersService.findOne(featureId, tenantId);
  }
}
