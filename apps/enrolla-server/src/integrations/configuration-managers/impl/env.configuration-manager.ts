import { env } from 'process';
import { ConfigurationManager } from '../configuration-manager.interface';

export class EnvConfigurationManager implements ConfigurationManager {
  async getValue<T>(tenantId: string, key: string): Promise<T | null> {
    const tenantKey = `${tenantId}_${key}`.toUpperCase();
    const value = env[tenantKey];

    return value && (value as T);
  }
}
