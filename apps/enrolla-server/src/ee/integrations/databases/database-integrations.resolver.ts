import { UseGuards } from '@nestjs/common';
import { GraphQLAuthGuard } from '../../../authz/graphql-auth.guard';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TenantId } from '../../../authz/tenant.decorator';
import { MongoDBCustomersService } from '../databases/mongodb/mongodb-customers.service';
import { Integration } from '../dto/integration.entity';
import { DBFeatureMetadata } from '../databases/entities/db-feature-metadata.entity';
import {
  MongoDBConnectionOptions,
  ImportMongoCustomersInput,
  FetchMongoCustomersInput,
} from './mongodb/dto';
import { DBCustomer } from '../databases/entities/db-customer.entity';

@Resolver()
@UseGuards(GraphQLAuthGuard)
export class DatabaseIntegrationsResolver {
  constructor(
    private readonly mongodbCustomersService: MongoDBCustomersService
  ) {}

  @Query(() => [Integration])
  integrations(@TenantId() tenantId: string) {
    return [
      { name: 'auth0', isAvailable: false, isConfigured: false },
      { name: 'propelauth', isAvailable: false, isConfigured: false },
      { name: 'mongodb', isAvailable: false, isConfigured: false },
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
}
