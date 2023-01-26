import { DatabaseOptions } from './dto/connection-options.input';
import { FetchCustomersInput } from './dto/fetch-customers.input';
import { DBCustomerFeatures } from './entities/db-customer-features';
import { DBCustomer } from './entities/db-customer.entity';
import { DBFeatureMetadata } from './entities/db-feature-metadata.entity';

export interface CustomersDatabaseService {
  fetchSchema(options: DatabaseOptions): Promise<DBFeatureMetadata[]>;

  fetchCustomers(
    options: DatabaseOptions,
    fetchCustomersInput: FetchCustomersInput
  ): Promise<DBCustomer[]>;

  fetchCustomersFeatures(
    options: DatabaseOptions,
    organizationIdField: string,
    customerNameField: string,
    organizationIds: string[],
    featureNames: string[]
  ): Promise<DBCustomerFeatures[]>;
}
