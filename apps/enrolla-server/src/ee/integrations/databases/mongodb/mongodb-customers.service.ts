import { Injectable, Logger } from '@nestjs/common';
import { DBFeatureMetadata } from '../entities/db-feature-metadata.entity';
import * as parseSchema from 'mongodb-schema';
import { DBCustomer } from '../entities/db-customer.entity';
import { getFeatureType, useCollection } from './utils';
import { FeaturesService } from '../../../../features/features.service';
import { CustomersService } from '../../../../customers/customers.service';
import { DatabaseOptions } from '../dto/connection-options.input';
import { FetchCustomersInput } from '../dto/fetch-customers.input';
import { ImportCustomersInput } from '../dto/import-customers.input';
import { FeatureType } from '@prisma/client';
import { DBFeature } from '../entities/db-feature.entity';

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

  async importCustomers(
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

    return await useCollection(
      async (collection) => {
        try {
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

          return true;
        } catch (error) {
          this.logger.error(error);

          return false;
        }
      },
      options,
      this.logger
    );
  }

  async fetchCustomersFeatures(
    options: DatabaseOptions,
    organizationIdField: string,
    organizationIds: string[],
    featureNames: string[]
  ): Promise<DBCustomer[]> {
    return await useCollection(
      async (collection) => {
        return await collection
          .find({ [organizationIdField]: { $in: organizationIds } })
          .map((customer) => {
            const features = featureNames.map((feature) => {
              return new DBFeature(
                feature,
                customer[feature],
                FeatureType.JSON
              );
            });

            return new DBCustomer(
              customer.organizationId,
              customer.name,
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
