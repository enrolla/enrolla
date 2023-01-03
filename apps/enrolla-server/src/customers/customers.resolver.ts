import {
  Resolver,
  Query,
  Mutation,
  Args,
  Parent,
  ResolveField,
} from '@nestjs/graphql';
import { CustomersService } from './customers.service';
import { Customer } from './entities/customer.entity';
import { CreateCustomerInput } from './dto/create-customer.input';
import { UpdateCustomerInput } from './dto/update-customer.input';
import { TenantId } from '../authz/tenant.decorator';
import { GraphQLJWTAuthGuard } from '../authz/graphql-jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Package } from '../packages/entities/package.entity';
import { PackagesService } from '../packages/packages.service';
import { FeatureInstancesService } from '../feature-instances/feature-instances.service';
import { CustomerFeature } from '../feature-instances/entities/customer-feature.entity';
import { FeatureValue } from '../feature-instances/entities/feature-value.entity';

@Resolver(() => Customer)
@UseGuards(GraphQLJWTAuthGuard)
export class CustomersResolver {
  constructor(
    private readonly customersService: CustomersService,
    private readonly packagesService: PackagesService,
    private readonly featuresInstancesService: FeatureInstancesService
  ) {}

  @Mutation(() => Customer)
  async createCustomer(
    @TenantId() tenantId: string,
    @Args('input') createCustomerInput: CreateCustomerInput
  ) {
    return await this.customersService.create(createCustomerInput, tenantId);
  }

  @Query(() => [Customer], { name: 'customers' })
  async findAll(@TenantId() tenantId: string) {
    return await this.customersService.findAll(tenantId);
  }

  @Query(() => Customer, { name: 'customer' })
  async findOne(
    @TenantId() tenantId: string,
    @Args('id', { type: () => String }) id: string
  ) {
    return await this.customersService.findOne(id, tenantId);
  }

  @Mutation(() => Customer)
  async updateCustomer(
    @TenantId() tenantId: string,
    @Args('input') updateCustomerInput: UpdateCustomerInput
  ) {
    return await this.customersService.update(
      updateCustomerInput.id,
      updateCustomerInput,
      tenantId
    );
  }

  @Mutation(() => Customer)
  async removeCustomer(
    @TenantId() tenantId: string,
    @Args('id', { type: () => String }) id: string
  ) {
    return await this.customersService.remove(id, tenantId);
  }

  @ResolveField(() => Package, { nullable: true })
  async package(@Parent() customer: Customer) {
    const { packageId, tenantId } = customer;

    return packageId && this.packagesService.findOne(packageId, tenantId);
  }

  @ResolveField(() => [CustomerFeature])
  async features(@Parent() customer: Customer) {
    const { id, tenantId } = customer;

    return this.featuresInstancesService.findByCustomerId(id, tenantId);
  }

  @ResolveField(() => [FeatureValue])
  async configuration(
    @TenantId() tenantId: string,
    @Parent() customer: Customer
  ) {
    return await this.customersService.getEffectiveConfiguration(
      customer,
      tenantId
    );
  }
}
