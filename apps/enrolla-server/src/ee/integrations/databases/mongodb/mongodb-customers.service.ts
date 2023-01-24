import { Injectable, Logger } from '@nestjs/common';
import { DBFeatureMetadata } from '../entities/db-feature-metadata.entity';
import { ConnectionOptions } from '../connection-options.interface';
import * as parseSchema from 'mongodb-schema';
import { DBCustomer } from '../entities/db-customer.entity';
import { getFeatureType, useCollection } from './utils';
import { FeaturesService } from '../../../../features/features.service';
import { CustomersService } from '../../../../customers/customers.service';
import { ImportMongoCustomersInput } from './dto/import-mongo-customers.input';
import { FetchMongoCustomersInput } from './dto/fetch-mongo-customers.input';

@Injectable()
export class MongoDBCustomersService {
  private readonly logger = new Logger();

  constructor(
    private featuresService: FeaturesService,
    private customersService: CustomersService
  ) {}

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

  async fetchCustomers(
    fetchMongoCustomersInput: FetchMongoCustomersInput
  ): Promise<DBCustomer[]> {
    const { organizationIdField, customerNameField, connectionOptions } =
      fetchMongoCustomersInput;

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
      connectionOptions,
      this.logger
    );
  }

  async importCustomers(tenantId: string, input: ImportMongoCustomersInput) {
    const {
      organizationIdField,
      customerNameField,
      organizationIds,
      features,
    } = input;

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
    ).reduce((acc, feature) => (acc[feature.key] = feature.id), {});

    return await useCollection(
      async (collection) => {
        await collection
          .find({ [organizationIdField]: { $in: organizationIds } })
          .forEach((customer) => {
            this.customersService.create(
              {
                organizationId: customer[organizationIdField],
                name: customer[customerNameField],
                features: features.map((feature) => {
                  return {
                    featureId: tenantFeatureIds[feature.destinationName],
                    value: customer[feature.sourceName],
                  };
                }),
              },
              tenantId
            );
          });
      },
      input.connectionOptions,
      this.logger
    );
  }
}
