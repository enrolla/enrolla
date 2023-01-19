import { UseGuards } from '@nestjs/common';
import { GraphQLAuthGuard } from '../authz/graphql-auth.guard';
import { CustomersService } from '../customers/customers.service';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { TenantId } from '../authz/tenant.decorator';
import { ImportCustomersInput } from './dto/import-customers.input';
import { MongoDBService } from './databases/mongodb/mongodb.service';
import { FeaturesService } from '../features/features.service';
import {
  defaultValueForFeatureType,
  inferFeatureType,
} from './databases/mongodb/utils';
import { Feature } from '@prisma/client';
import { Customer } from '../customers/entities/customer.entity';

@Resolver()
@UseGuards(GraphQLAuthGuard)
export class IntegrationsResolver {
  constructor(
    private readonly featuresService: FeaturesService,
    private readonly mongodbService: MongoDBService,
    private readonly customersService: CustomersService
  ) {}

  @Mutation(() => [Customer])
  async importCustomers(
    @TenantId() tenantId: string,
    @Args('input') importCustomersInput: ImportCustomersInput
  ) {
    const customers = await this.mongodbService.getCustomers(
      importCustomersInput.connectionOptions,
      importCustomersInput.idFieldName,
      importCustomersInput.featureFieldNames
    );

    const createdFeatures = new Array<Feature>();

    await Promise.all(
      customers[0].features.map(async (feature) => {
        const featureType = inferFeatureType(feature.value);
        const createdFeature = await this.featuresService.create(
          {
            key: feature.key,
            type: featureType,
            defaultValue: defaultValueForFeatureType(featureType),
          },
          tenantId
        );
        createdFeatures.push(createdFeature);
      })
    );

    return await Promise.all(
      customers.map(async (customer) => {
        return await this.customersService.create(
          {
            organizationId: customer.organizationId,
            name: customer.organizationId,
            features: customer.features.map((feature) => {
              const createdFeature = createdFeatures.find(
                (createdFeature) => createdFeature.key === feature.key
              );

              return {
                featureId: createdFeature.id,
                value: feature.value,
              };
            }),
          },
          tenantId
        );
      })
    );
  }
}
