import { UseGuards } from '@nestjs/common';
import { GraphQLAuthGuard } from '../../authz/graphql-auth.guard';
import { CustomersService } from '../../customers/customers.service';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TenantId } from '../../authz/tenant.decorator';
import { MongoDBCustomersService } from './databases/mongodb/mongodb-customers.service';
import { FeaturesService } from '../../features/features.service';
import { Integration } from './dto/integration.entity';
import { DBFeatureMetadata } from './databases/entities/db-feature-metadata.entity';
import { MongoDBConnectionOptions } from './databases/mongodb/dto/mongodb-connection-options.input';
import { ImportMongoCustomersInput } from './databases/mongodb/dto/import-mongo-customers.input';
import { FetchMongoCustomersInput } from './databases/mongodb/dto/fetch-mongo-customers.input';
import { DBCustomer } from './databases/entities/db-customer.entity';
import { ConfigureAuth0OrganizationManagerInput, ConfigurePropelauthOrganizationManagerInput } from './organization-managers/dto';

@Resolver()
@UseGuards(GraphQLAuthGuard)
export class IntegrationsResolver {
  constructor(
    private readonly featuresService: FeaturesService,
    private readonly mongodbCustomersService: MongoDBCustomersService,
    private readonly customersService: CustomersService
  ) {}

  @Query(() => [Integration])
  integrations(@TenantId() tenantId: string) {
    return [
      { name: 'auth0', isConfigured: false },
      { name: 'propelauth', isConfigured: false },
      { name: 'mongodb', isConfigured: false },
    ];
  }

  @Query(() => [DBFeatureMetadata])
  async fetchMongoSchema(
    @TenantId() tenantId: string,
    @Args('input') connectionOptions: MongoDBConnectionOptions
  ) {
    return await this.mongodbCustomersService.fetchSchema(connectionOptions);
  }

  @Query(() => [DBCustomer])
  async fetchMongoCustomers(
    @TenantId() tenantId: string,
    @Args('input') input: FetchMongoCustomersInput
  ) {
    return await this.mongodbCustomersService.fetchCustomers(input);
  }

  @Mutation(() => Boolean)
  async importMongoCustomers(
    @TenantId() tenantId: string,
    @Args('input') input: ImportMongoCustomersInput
  ) {
    return await this.mongodbCustomersService.importCustomers(tenantId, input);
  }

  @Mutation(() => Boolean)
  async configureAuth0OrganizationManager(
    @TenantId() tenantId: string,
    @Args('input') input: ConfigureAuth0OrganizationManagerInput
  ) {
    return true
  }

  @Mutation(() => Boolean)
  async configurePropelauthOrganizationManager(
    @TenantId() tenantId: string,
    @Args('input') input: ConfigurePropelauthOrganizationManagerInput
  ) {
    return true
  }
}
