import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CustomersService } from './customers.service';
import { Customer } from './entities/customer.entity';
import { CreateCustomerInput } from './dto/create-customer.input';
import { UpdateCustomerInput } from './dto/update-customer.input';
import { TenantId } from '../authz/tenant.decorator';
import { GraphQLJWTAuthGuard } from '../authz/graphql-jwt-auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver(() => Customer)
@UseGuards(GraphQLJWTAuthGuard)
export class CustomersResolver {
  constructor(private readonly customersService: CustomersService) {}

  @Mutation(() => Customer)
  async createCustomer(
    @TenantId() tenantId: string,
    @Args('createCustomerInput') createCustomerInput: CreateCustomerInput
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
    @Args('updateCustomerInput') updateCustomerInput: UpdateCustomerInput
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
}
