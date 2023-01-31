import { FeatureType } from '@prisma/client';
import { Collection, MongoClient } from 'mongodb';
import { Logger } from '@nestjs/common';
import { MongoDBOptions } from './dto/mongodb-options.input';
import { DatabaseOptions } from '../dto/connection-options.input';

export function buildConnectionString(
  connectionOptions: MongoDBOptions
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
  options: DatabaseOptions,
  logger: Logger
) {
  const mongoOptions = options as MongoDBOptions;
  const client = new MongoClient(buildConnectionString(mongoOptions));

  await client.connect();
  const collection = client
    .db(mongoOptions.database)
    .collection(mongoOptions.collection);

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
