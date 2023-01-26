import { UseGuards } from '@nestjs/common';
import { GraphQLAuthGuard } from '../../authz/graphql-auth.guard';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TenantId } from '../../authz/tenant.decorator';
import { MongoDBCustomersService } from './databases/mongodb/mongodb-customers.service';
import { Integration } from './dto/integration.entity';
import { DBFeatureMetadata } from './databases/entities/db-feature-metadata.entity';
import { DBCustomer } from './databases/entities/db-customer.entity';
import { PostgresQLCustomersService } from './databases/postgresql/postgresql-customers.service';
import { MongoDBOptions } from './databases/mongodb/dto/mongodb-options.input';
import { PostgresQLOptions } from './databases/postgresql/dto/postgresql-options.input';
import { FetchCustomersInput } from './databases/dto/fetch-customers.input';
import { ImportCustomersInput } from './databases/dto/import-customers.input';
import { ExternalCustomersService } from './databases/external-customers.service';
import { DatabaseType } from './databases/database-type.enum';
import {
  ConfigureAuth0OrganizationManagerInput,
  ConfigurePropelauthOrganizationManagerInput,
} from './organization-managers/dto';
import {
  Auth0OrganizationManager,
  PropelAuthOrganizationManager,
} from './organization-managers/impl';

@Resolver()
@UseGuards(GraphQLAuthGuard)
export class IntegrationsResolver {
  constructor(
    private readonly mongodbCustomersService: MongoDBCustomersService,
    private readonly postgresqlCustomersService: PostgresQLCustomersService,
    private readonly externalCustomersService: ExternalCustomersService
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
    @Args('mongoOptions') mongoOptions: MongoDBOptions
  ) {
    return await this.mongodbCustomersService.fetchSchema(mongoOptions);
  }

  @Query(() => [DBCustomer])
  async fetchMongoCustomers(
    @TenantId() tenantId: string,
    @Args('mongoOptions') mongoOptions: MongoDBOptions,
    @Args('input') input: FetchCustomersInput
  ) {
    return await this.mongodbCustomersService.fetchCustomers(
      mongoOptions,
      input
    );
  }

  @Mutation(() => Boolean)
  async importMongoCustomers(
    @TenantId() tenantId: string,
    @Args('mongoOptions') mongoOptions: MongoDBOptions,
    @Args('input') input: ImportCustomersInput
  ) {
    return await this.externalCustomersService.import(
      tenantId,
      DatabaseType.MongoDB,
      mongoOptions,
      input
    );
  }

  @Query(() => [DBFeatureMetadata])
  async fetchPostgresSchema(
    @TenantId() tenantId: string,
    @Args('postgresOptions') connectionOptions: PostgresQLOptions
  ) {
    return await this.postgresqlCustomersService.fetchSchema(connectionOptions);
  }

  @Query(() => [DBCustomer])
  async fetchPostgresCustomers(
    @TenantId() tenantId: string,
    @Args('postgresOptions') postgresOptions: PostgresQLOptions,
    @Args('input') input: FetchCustomersInput
  ) {
    return await this.postgresqlCustomersService.fetchCustomers(
      postgresOptions,
      input
    );
  }

  @Mutation(() => Boolean)
  async importPostgresCustomers(
    @TenantId() tenantId: string,
    @Args('postgresOptions') postgresOptions: PostgresQLOptions,
    @Args('input') input: ImportCustomersInput
  ) {
    return await this.externalCustomersService.import(
      tenantId,
      DatabaseType.PostgresQL,
      postgresOptions,
      input
    );
  }

  @Mutation(() => Boolean)
  async configureAuth0OrganizationManager(
    @TenantId() tenantId: string,
    @Args('input') input: ConfigureAuth0OrganizationManagerInput
  ) {
    return await Auth0OrganizationManager.configure(tenantId, input);
  }

  @Mutation(() => Boolean)
  async configurePropelauthOrganizationManager(
    @TenantId() tenantId: string,
    @Args('input') input: ConfigurePropelauthOrganizationManagerInput
  ) {
    return await PropelAuthOrganizationManager.configure(tenantId, input);
  }
}
