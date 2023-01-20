import { MongoDBConnectionOptions } from './mongodb/mongodb-connection-options';

export interface FeaturesSource {
  retrieveSchema(connectionOptions: MongoDBConnectionOptions): Promise<object>;
}
