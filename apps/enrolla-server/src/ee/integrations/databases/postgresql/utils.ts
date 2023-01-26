import { Logger } from '@nestjs/common';
import { Client } from 'pg';
import { DatabaseOptions } from '../dto/connection-options.input';
import { FeatureType } from '@prisma/client';
import { types } from 'pg';
import { PostgresQLOptions } from './dto/postgresql-options.input';

export async function useClient<T>(
  method: (client: Client) => Promise<T>,
  options: DatabaseOptions,
  logger: Logger
) {
  const client = new Client({
    host: options.host,
    port: options.port ?? 5432,
    database: options.database,
    user: options.username ?? '',
    password: options.password ?? '',
  });
  await client.connect();

  try {
    return await method(client);
  } catch (err) {
    logger.log(err);
    return null;
  } finally {
    client.end();
  }
}

export function tableName(options: PostgresQLOptions): string {
  return `${options.schema}.${options.table}`;
}

export function getFeatureTypeForTypeId(typeId: number): FeatureType {
  switch (typeId) {
    case types.builtins.INT2:
    case types.builtins.INT4:
    case types.builtins.INT8:
      return FeatureType.INTEGER;
    case types.builtins.BOOL:
    case types.builtins.BOOLEAN:
      return FeatureType.BOOLEAN;
    case types.builtins.TEXT:
    case types.builtins.VARCHAR:
    case types.builtins.CHAR:
      return FeatureType.STRING;
    case types.builtins.ARRAY:
      return FeatureType.ARRAY;
    case types.builtins.JSON:
    case types.builtins.JSONB:
    default:
      return FeatureType.JSON;
  }
}
