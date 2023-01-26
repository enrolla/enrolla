import { Injectable, Logger } from '@nestjs/common';
import { DBFeatureMetadata } from '../entities/db-feature-metadata.entity';
import { getFeatureTypeForTypeId, tableName, useClient } from './utils';
import { PostgresQLOptions } from './dto/postgresql-options.input';
import { DatabaseOptions } from '../dto/connection-options.input';
import { CustomersDatabaseService } from '../customers-database-service.interface';
import { FetchCustomersInput } from '../dto/fetch-customers.input';
import { DBCustomer } from '../entities/db-customer.entity';
import { DBCustomerFeatures } from '../entities/db-customer-features';

@Injectable()
export class PostgresQLCustomersService implements CustomersDatabaseService {
  private readonly logger = new Logger();

  async fetchSchema(options: DatabaseOptions): Promise<DBFeatureMetadata[]> {
    const postgresOptions = options as PostgresQLOptions;

    return await useClient(
      async (client) => {
        const query = `SELECT * FROM ${tableName(postgresOptions)} LIMIT 1`;
        const result = await client.query(query);

        return result.fields.map((field) => {
          return new DBFeatureMetadata(
            field.name,
            getFeatureTypeForTypeId(field.dataTypeID)
          );
        });
      },
      options,
      this.logger
    );
  }

  async fetchCustomers(
    options: DatabaseOptions,
    fetchCustomersInput: FetchCustomersInput
  ): Promise<DBCustomer[]> {
    const postgresOptions = options as PostgresQLOptions;
    const { organizationIdField, customerNameField } = fetchCustomersInput;

    return await useClient(
      async (client) => {
        const query = `SELECT ${organizationIdField},${customerNameField} FROM ${tableName(
          postgresOptions
        )}`;
        const result = await client.query(query);

        return result.rows.map((row) => {
          return new DBCustomer(
            row[organizationIdField],
            row[customerNameField]
          );
        });
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
    const postgresOptions = options as PostgresQLOptions;

    return await useClient(
      async (client) => {
        const query = `SELECT ${organizationIdField},${customerNameField},${featureNames.join(
          ','
        )} FROM ${tableName(
          postgresOptions
        )} WHERE ${organizationIdField} IN (${organizationIds
          .map((id) => `'${id}'`)
          .join(',')})`;
        const result = await client.query(query);

        return result.rows.map((row) => {
          return new DBCustomerFeatures(
            row[organizationIdField],
            row[customerNameField],
            featureNames.map((featureName) => {
              return {
                name: featureName,
                value: row[featureName],
                type: getFeatureTypeForTypeId(
                  result.fields.find((field) => field.name === featureName)
                    .dataTypeID
                ),
              };
            })
          );
        });
      },
      options,
      this.logger
    );
  }
}
