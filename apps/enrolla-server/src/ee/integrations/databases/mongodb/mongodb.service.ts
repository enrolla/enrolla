import { Injectable, Logger } from '@nestjs/common';
import { DBFeatureMetadata } from '../entities/db-feature-metadata.entity';
import { DBFeature } from '../entities/db-feature.entity';
import { ConnectionOptions } from '../connection-options.interface';
import * as parseSchema from 'mongodb-schema';
import { DBCustomer } from '../entities/db-customer.entity';
import { getFeatureType, useCollection } from './utils';
import { DBCustomersService } from '../db-customers-service.interface';

@Injectable()
export class MongoDBCustomersService implements DBCustomersService {
  private readonly logger = new Logger();

  async findOne(
    id: string,
    idFieldName: string,
    featureFields: string[],
    options: ConnectionOptions
  ): Promise<DBCustomer> {
    return await useCollection(
      async (collection) => {
        const customer = await collection.findOne({ [idFieldName]: id });

        const features = featureFields.map((featureFieldName) => {
          const type = getFeatureType(typeof customer[featureFieldName]);

          return new DBFeature(
            featureFieldName,
            type,
            customer[featureFieldName]
          );
        });

        return new DBCustomer(id, features);
      },
      options,
      this.logger
    );
  }

  async findAll(
    idFieldName: string,
    featureFields: string[],
    options: ConnectionOptions
  ): Promise<DBCustomer[]> {
    return await useCollection(
      async (collection) => {
        const customers = await collection.find().toArray();

        return customers.map((customer) => {
          const features = featureFields.map((featureFieldName) => {
            const type = getFeatureType(typeof customer[featureFieldName]);

            return new DBFeature(
              featureFieldName,
              type,
              customer[featureFieldName]
            );
          });

          return new DBCustomer(customer[idFieldName], features);
        });
      },
      options,
      this.logger
    );
  }

  async fetchSchema(options: ConnectionOptions): Promise<DBFeatureMetadata[]> {
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

  async getCustomerIds(
    idFieldName: string,
    options: ConnectionOptions
  ): Promise<string[]> {
    return await useCollection(
      async (collection) => {
        return await collection.distinct(idFieldName);
      },
      options,
      this.logger
    );
  }
}
