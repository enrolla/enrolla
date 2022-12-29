import { Injectable } from '@nestjs/common';
import { EnvConfigurationManager } from '../integrations/configuration-managers/impl/env.configuration-manager';

@Injectable()
export class ConfigurationsService implements ConfigurationManager {
  private envConfigurationManager: EnvConfigurationManager =
    new EnvConfigurationManager();

  async getValue<T>(tenantId: string, key: string): Promise<T> {
    return await this.envConfigurationManager.getValue(tenantId, key);
  }
}
