import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GraphQLJWTAuthGuard } from '../authz/graphql-jwt-auth.guard';
import { FeaturesService } from '../features/features.service';
import { Customer } from '../customers/entities/customer.entity';
import { CustomersService } from '../customers/customers.service';
import { CustomerFeature } from './entities/customer-feature.entity';
import { Feature } from '../features/entities/feature.entity';

@Resolver(() => CustomerFeature)
@UseGuards(GraphQLJWTAuthGuard)
export class CustomerFeaturesResolver {
  constructor(
    private readonly customersService: CustomersService,
    private readonly featuresService: FeaturesService
  ) {}

  @ResolveField(() => Feature)
  async feature(@Parent() customerFeature: CustomerFeature) {
    const { featureId, tenantId } = customerFeature;

    return this.featuresService.findOne(featureId, tenantId);
  }

  @ResolveField(() => Customer)
  async customer(@Parent() customerFeature: CustomerFeature) {
    const { featureId, tenantId } = customerFeature;

    return this.customersService.findOne(featureId, tenantId);
  }
}
