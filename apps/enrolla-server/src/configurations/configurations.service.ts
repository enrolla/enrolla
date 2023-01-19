import { Inject, Injectable } from '@nestjs/common';
import { ConfigurationManager } from './configuration-manager.interface';

@Injectable()
export class ConfigurationsService implements ConfigurationManager {
  constructor(
    @Inject('ConfigurationManager')
    private configurationManager: ConfigurationManager
  ) {}

  async getValue<T>(tenantId: string, key: string): Promise<T | undefined> {
    return await this.configurationManager.getValue(tenantId, key);
  }

  async getSecretValue(
    tenantId: string,
    key: string
  ): Promise<string | undefined> {
    return await this.configurationManager.getSecretValue(tenantId, key);
  }
}
