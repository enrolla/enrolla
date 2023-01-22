import { FeatureType } from '@prisma/client';
import { MongoDBConnectionOptions } from './mongodb-connection-options';
import { ConnectionOptions } from '../connection-options.interface';
import { Collection, MongoClient } from 'mongodb';
import { Logger } from '@nestjs/common';

export function buildConnectionString(
  connectionOptions: MongoDBConnectionOptions
): string {
  let connectionString = 'mongodb';

  if (connectionOptions.isSrv) {
    connectionString += '+srv';
  }

  connectionString += '://';

  if (connectionOptions.username) {
    connectionString += `${connectionOptions.username}`;

    if (connectionOptions.password) {
      connectionString += `:${connectionOptions.password}@`;
    }
  }

  connectionString += `${connectionOptions.host}`;

  if (connectionOptions.port) {
    connectionString += `:${connectionOptions.port}`;
  }

  return connectionString;
}

export async function useCollection<T>(
  method: (collection: Collection) => Promise<T>,
  options: ConnectionOptions,
  logger: Logger
) {
  const connectionOptions = options as MongoDBConnectionOptions;
  const client = new MongoClient(buildConnectionString(connectionOptions));

  await client.connect();
  const collection = client
    .db(connectionOptions.database)
    .collection(connectionOptions.collection);

  try {
    return await method(collection);
  } catch (err) {
    logger.log(err);
    return null;
  } finally {
    client.close();
  }
}

export function getFeatureType(mongoType: string): FeatureType {
  switch (mongoType.toLowerCase()) {
    case 'string':
      return FeatureType.STRING;
    case 'number':
      return FeatureType.INTEGER;
    case 'boolean':
      return FeatureType.BOOLEAN;
    case 'objectid':
      return FeatureType.STRING;
    case 'array':
      return FeatureType.ARRAY;
    default:
      return FeatureType.JSON;
  }
}
