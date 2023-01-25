import { DatabaseOptions } from './dto/connection-options.input';
import { FetchCustomersInput } from './dto/fetch-customers.input';
import { DBCustomer } from './entities/db-customer.entity';
import { DBFeatureMetadata } from './entities/db-feature-metadata.entity';

export interface CustomersDatabaseService {
  fetchSchema(options: DatabaseOptions): Promise<DBFeatureMetadata[]>;

  fetchCustomers(
    options: DatabaseOptions,
    fetchMongoCustomersInput: FetchCustomersInput
  ): Promise<DBCustomer[]>;

  fetchCustomersFeatures(
    options: DatabaseOptions,
    organizationIdField: string,
    organizationIds: string[],
    featureNames: string[]
  ): Promise<DBCustomer[]>;
}
