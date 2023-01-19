import { env } from 'process';
import { ConfigurationManager } from '../../configuration-manager.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EnvConfigurationManager implements ConfigurationManager {
  async getValue<T>(tenantId: string, key: string) {
    const tenantKey = `${tenantId}_${key}`.toUpperCase();
    const value = env[tenantKey];

    return value && (value as T);
  }

  async getSecretValue(tenantId: string, key: string) {
    return (await this.getValue(tenantId, key)) as string;
  }
}
