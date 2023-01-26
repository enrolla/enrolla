import { Injectable } from '@nestjs/common';
import { FeaturesService } from '../../../features/features.service';
import { CustomersService } from '../../../customers/customers.service';
import { MongoDBCustomersService } from './mongodb/mongodb-customers.service';
import { PostgresQLCustomersService } from './postgresql/postgresql-customers.service';
import { DatabaseOptions } from './dto/connection-options.input';
import { ImportCustomersInput } from './dto/import-customers.input';
import { CustomersDatabaseService } from './customers-database-service.interface';
import { DatabaseType } from './database-type.enum';

@Injectable()
export class ExternalCustomersService {
  constructor(
    private featuresService: FeaturesService,
    private customersService: CustomersService,
    private mongoCustomersService: MongoDBCustomersService,
    private postgresCustomersService: PostgresQLCustomersService
  ) {}

  async import(
    tenantId: string,
    databaseType: DatabaseType,
    options: DatabaseOptions,
    importCustomersInput: ImportCustomersInput
  ) {
    const {
      organizationIdField,
      customerNameField,
      organizationIds,
      features,
    } = importCustomersInput;

    await this.featuresService.createMany(
      features.map((feature) => {
        return {
          key: feature.destinationName,
          type: feature.type,
        };
      }),
      tenantId
    );

    const tenantFeatureIds = (
      await this.featuresService.findAll(tenantId)
    ).reduce((acc, feature) => {
      acc[feature.key] = feature.id;
      return acc;
    }, {});

    let customersDbService: CustomersDatabaseService;

    switch (databaseType) {
      case DatabaseType.MongoDB:
        customersDbService = this.mongoCustomersService;
        break;
      case DatabaseType.PostgresQL:
        customersDbService = this.postgresCustomersService;
        break;
      default:
        throw new Error('Unsupported database type');
    }

    const customers = await customersDbService.fetchCustomersFeatures(
      options,
      organizationIdField,
      customerNameField,
      organizationIds,
      features.map((feature) => feature.sourceName)
    );

    customers.forEach((customer) => {
      const customerFeatures = features.map((feature) => {
        return {
          featureId: tenantFeatureIds[feature.destinationName],
          value: {
            value: customer.features.find((f) => f.name === feature.sourceName)
              .value,
          },
        };
      });

      this.customersService.create(
        {
          name: customer.name,
          organizationId: customer.organizationId,
          features: customerFeatures,
        },
        tenantId
      );
    });

    return true;
  }
}
