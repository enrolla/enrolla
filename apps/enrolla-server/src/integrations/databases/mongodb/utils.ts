import { FeatureType } from '@prisma/client';
import { MongoDBConnectionOptions } from './mongodb-connection-options';

export function inferFeatureType(value: any): FeatureType {
  switch (typeof value) {
    case 'string':
      return FeatureType.STRING;
    case 'number':
      return FeatureType.INTEGER;
    case 'boolean':
      return FeatureType.BOOLEAN;
    default:
      return FeatureType.JSON;
  }
}

export function buildConnectionString(
  connectionOptions: MongoDBConnectionOptions
): string {
  let connectionString = 'mongodb';

  if (connectionOptions.isSrv) {
    connectionString += '+srv';
  }

  connectionString += '://';

  if (connectionOptions.username) {
    connectionString = `${connectionOptions.username}`;

    if (connectionOptions.password) {
      connectionString += `:${connectionOptions.password}@`;
    }
  }

  connectionString += `${connectionOptions.host}`;

  if (connectionOptions.port) {
    connectionString += `:${connectionOptions.port}`;
  }

  console.log(connectionString);

  return connectionString;
}

export function defaultValueForFeatureType(featureType: FeatureType) {
  switch (featureType) {
    case FeatureType.STRING:
      return '';
    case FeatureType.INTEGER:
      return 0;
    case FeatureType.BOOLEAN:
      return false;
    default:
      return {};
  }
}
