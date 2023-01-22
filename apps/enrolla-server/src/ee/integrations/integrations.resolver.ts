import { UseGuards } from '@nestjs/common';
import { GraphQLAuthGuard } from '../../authz/graphql-auth.guard';
import { CustomersService } from '../../customers/customers.service';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { TenantId } from '../../authz/tenant.decorator';
import { MongoDBCustomersService } from './databases/mongodb/mongodb.service';
import { FeaturesService } from '../../features/features.service';
import { Integration } from './dto/integration.entity';
import { DBFeatureMetadata } from './databases/entities/db-feature-metadata.entity';
import { MongoDBConnectionOptions } from './databases/mongodb/mongodb-connection-options';

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
  async mongoSchema(
    @TenantId() tenantId: string,
    @Args('input') connectionOptions: MongoDBConnectionOptions
  ) {
    return await this.mongodbCustomersService.fetchSchema(connectionOptions);
  }

  @Query(() => [String])
  async mongoCustomerIds(
    @TenantId() tenantId: string,
    @Args('input') connectionOptions: MongoDBConnectionOptions,
    @Args('idFieldName') idFieldName: string
  ) {
    return await this.mongodbCustomersService.getCustomerIds(
      idFieldName,
      connectionOptions
    );
  }

  // @Query(() => [DBFeature])
  // async mongoCustomerFeatures(
  //   @TenantId() tenantId: string,
  //   @Args('id') id: string,
  //   @Args('idFieldName') idFieldName: string,
  //   @Args('featureFields') featureFields: string[],
  //   @Args('input') connectionOptions: MongoDBConnectionOptions
  // ) {
  //   return await this.mongodbService.fetchCustomerFeatures(
  //     id,
  //     idFieldName,
  //     featureFields,
  //     connectionOptions
  //   );
  // }
}
