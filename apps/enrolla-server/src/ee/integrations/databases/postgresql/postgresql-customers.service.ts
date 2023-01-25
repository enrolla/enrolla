import { Injectable, Logger } from '@nestjs/common';
import { CustomersService } from '../../../../customers/customers.service';
import { FeaturesService } from '../../../../features/features.service';
import { DBFeatureMetadata } from '../entities/db-feature-metadata.entity';
import { useClient } from './utils';
import { FeatureType } from '@prisma/client';
import { PostgresQLOptions } from './dto/postgresql-options.input';
import { DatabaseOptions } from '../dto/connection-options.input';
import { CustomersDatabaseService } from '../customers-database-service.interface';
import { FetchCustomersInput } from '../dto/fetch-customers.input';
import { DBCustomer } from '../entities/db-customer.entity';

@Injectable()
export class PostgresQLCustomersService implements CustomersDatabaseService {
  private readonly logger = new Logger();

  constructor(
    private featuresService: FeaturesService,
    private customersService: CustomersService
  ) {}

  async fetchSchema(options: DatabaseOptions): Promise<DBFeatureMetadata[]> {
    const postgresOptions = options as PostgresQLOptions;

    return await useClient(
      async (client) => {
        const row = client.query(
          `SELECT * FROM ${postgresOptions.schema}.${postgresOptions.table} LIMIT 1`
        );

        return Object.keys(row).map((key) => {
          return new DBFeatureMetadata(key, FeatureType.STRING);
        });
      },
      options,
      this.logger
    );
  }

  async fetchCustomers(
    options: DatabaseOptions,
    fetchMongoCustomersInput: FetchCustomersInput
  ): Promise<DBCustomer[]> {
    throw new Error('Method not implemented.');
  }

  async fetchCustomersFeatures(
    options: DatabaseOptions,
    organizationIdField: string,
    customerNameField: string,
    organizationIds: string[],
    featureNames: string[]
  ): Promise<DBCustomer[]> {
    throw new Error('Method not implemented.');
  }
}
