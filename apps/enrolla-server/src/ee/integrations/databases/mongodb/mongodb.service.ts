import { Injectable } from '@nestjs/common';
import { FeaturesSource } from '../features-source.interface';
import { MongoDBConnectionOptions } from './mongodb-connection-options';
import parseSchema from 'mongodb-schema';
import {
  CustomersSource,
  InferredCustomer,
} from '../customers-source.interface';
import { MongoClient } from 'mongodb';
import { buildConnectionString } from './utils';

@Injectable()
export class MongoDBService implements FeaturesSource, CustomersSource {
  async getCustomers(
    connectionOptions: MongoDBConnectionOptions,
    idFieldName: string,
    feautreFields: string[]
  ): Promise<InferredCustomer[]> {
    const client = new MongoClient(buildConnectionString(connectionOptions));

    await client.connect();

    const cursor = await client
      .db(connectionOptions.database)
      .collection(connectionOptions.collection)
      .find({});

    const customers = [];

    await cursor.forEach((doc) => {
      const customer = {
        organizationId: doc[idFieldName],
        features: [],
      };

      feautreFields.forEach((featureFieldName) => {
        customer.features.push({
          key: featureFieldName,
          value: doc[featureFieldName],
        });
      });

      customers.push(customer);
    });

    client.close();

    return customers;
  }

  async retrieveSchema(
    connectionOptions: MongoDBConnectionOptions
  ): Promise<object> {
    // const client = new MongoClient(buildConnectionString(connectionOptions));

    // await client.connect();

    // parseSchema(
    //   client
    //     .db(connectionOptions.database)
    //     .collection(connectionOptions.database)
    //     .find(),
    //   function (err, schema) {
    //     if (err) return console.error(err);

    //     console.log(JSON.stringify(schema, null, 2));
    //     client.close();
    //   }
    // );

    // return {};
    return null;
  }
}
