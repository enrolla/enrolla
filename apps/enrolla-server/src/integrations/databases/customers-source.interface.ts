import { FeatureType } from '@prisma/client';
import { MongoDBConnectionOptions } from './mongodb/mongodb-connection-options';

export interface InferredFeature {
  key: string;
  value: any;
  type: FeatureType;
}

export interface InferredCustomer {
  organizationId: string;
  features: InferredFeature[];
}

export interface CustomersSource {
  getCustomers(
    connectionOptions: MongoDBConnectionOptions,
    idFieldName: string,
    feautreFields: string[]
  ): Promise<InferredCustomer[]>;
}
