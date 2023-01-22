import { ConnectionOptions } from './connection-options.interface';
import { DBCustomer } from './entities/db-customer.entity';
import { DBFeatureMetadata } from './entities/db-feature-metadata.entity';

export interface DBCustomersService {
  findOne(
    id: string,
    idFieldName: string,
    featureFields: string[],
    options: ConnectionOptions
  ): Promise<DBCustomer>;

  findAll(
    idFieldName: string,
    featureFields: string[],
    options: ConnectionOptions
  ): Promise<DBCustomer[]>;

  fetchSchema(options: ConnectionOptions): Promise<DBFeatureMetadata[]>;

  getCustomerIds(
    idFieldName: string,
    options: ConnectionOptions
  ): Promise<string[]>;
}
