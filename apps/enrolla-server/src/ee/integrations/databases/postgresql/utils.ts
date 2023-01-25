import { Logger } from '@nestjs/common';
import { Client } from 'pg';
import { DatabaseOptions } from '../dto/connection-options.input';

export async function useClient<T>(
  method: (client: Client) => Promise<T>,
  options: DatabaseOptions,
  logger: Logger
) {
  const client = new Client({
    host: options.host,
    port: options.port,
    database: options.database,
    user: options.username ?? '',
    password: options.password ?? '',
  });
  client.connect();

  try {
    return await method(client);
  } catch (err) {
    logger.log(err);
    return null;
  } finally {
    client.end();
  }
}
