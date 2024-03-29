import { Injectable, Logger } from '@nestjs/common';
import { DBFeatureMetadata } from '../entities/db-feature-metadata.entity';
import * as parseSchema from 'mongodb-schema';
import { DBCustomer } from '../entities/db-customer.entity';
import { getFeatureType, useCollection } from './utils';
import { FeaturesService } from '../../../../features/features.service';
import { CustomersService } from '../../../../customers/customers.service';
import { DatabaseOptions } from '../dto/connection-options.input';
import { FetchCustomersInput } from '../dto/fetch-customers.input';
import { DBFeature } from '../entities/db-feature.entity';
import { DBCustomerFeatures } from '../entities/db-customer-features';
import { featureTypeOfValue } from '../utils';

@Injectable()
export class MongoDBCustomersService {
  private readonly logger = new Logger();

  constructor(
    private featuresService: FeaturesService,
    private customersService: CustomersService
  ) {}

  async fetchSchema(options: DatabaseOptions): Promise<DBFeatureMetadata[]> {
    return await useCollection(
      async (collection) => {
        const schema = await parseSchema(collection.find());

        return schema.fields.map((field) => {
          return new DBFeatureMetadata(field.name, getFeatureType(field.type));
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
    const { organizationIdField, customerNameField } = fetchMongoCustomersInput;

    return await useCollection(
      async (collection) => {
        return await collection
          .find()
          .map((customer) => {
            return new DBCustomer(
              customer[organizationIdField],
              customer[customerNameField]
            );
          })
          .toArray();
      },
      options,
      this.logger
    );
  }

  async fetchCustomersFeatures(
    options: DatabaseOptions,
    organizationIdField: string,
    customerNameField: string,
    organizationIds: string[],
    featureNames: string[]
  ): Promise<DBCustomerFeatures[]> {
    return await useCollection(
      async (collection) => {
        return await collection
          .find({ [organizationIdField]: { $in: organizationIds } })
          .map((customer) => {
            const features = featureNames.map((featureName) => {
              return new DBFeature(
                featureName,
                featureTypeOfValue(customer[featureName]),
                customer[featureName]
              );
            });

            return new DBCustomerFeatures(
              customer[organizationIdField],
              customer[customerNameField],
              features
            );
          })
          .toArray();
      },
      options,
      this.logger
    );
  }
}
