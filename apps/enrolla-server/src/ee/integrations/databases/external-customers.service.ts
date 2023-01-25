import { Injectable } from '@nestjs/common';
import { FeaturesService } from '../../../features/features.service';
import { CustomersService } from '../../../customers/customers.service';
import { MongoDBCustomersService } from './mongodb/mongodb-customers.service';
import { PostgresQLCustomersService } from './postgresql/postgresql-customers.service';
import { DatabaseOptions } from './dto/connection-options.input';
import { ImportCustomersInput } from './dto/import-customers.input';
import { MongoDBOptions } from './mongodb/dto/mongodb-options.input';
import { DBCustomer } from './entities/db-customer.entity';
import { CustomersDatabaseService } from './customers-database-service.interface';
import { PostgresQLOptions } from './postgresql/dto/postgresql-options.input';

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

    switch (options.constructor) {
      case MongoDBOptions:
        customersDbService = this.mongoCustomersService;
        break;
      case PostgresQLOptions:
        customersDbService = this.postgresCustomersService;
        break;
      default:
        throw new Error('Unsupported database type');
    }

    const customers = await customersDbService.fetchCustomersFeatures(
      options,
      organizationIdField,
      organizationIds,
      features.map((feature) => feature.sourceName)
    );
  }
}
