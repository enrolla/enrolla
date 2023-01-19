import { Inject, Injectable } from '@nestjs/common';
import { ConfigurationManager } from './configuration-manager.interface';

@Injectable()
export class ConfigurationsService implements ConfigurationManager {
  constructor(
    @Inject('ConfigurationManager')
    private configurationManager: ConfigurationManager
  ) {}

  getValue<T>(tenantId: string, key: string): T | undefined {
    return this.configurationManager.getValue(tenantId, key);
  }

  getSecretValue(tenantId: string, key: string): string | undefined {
    return this.configurationManager.getSecretValue(tenantId, key);
  }
}
