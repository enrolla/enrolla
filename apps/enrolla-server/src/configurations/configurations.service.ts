import { Injectable } from '@nestjs/common';
import { EnvConfigurationManager } from './configuration-managers/impl/env.configuration-manager';
import { ConfigurationManager } from './configuration-manager.interface';
import { SdkConfigurationManager } from './configuration-managers/impl/sdk.configuration-manager';

@Injectable()
export class ConfigurationsService implements ConfigurationManager {
  private envConfigurationManager: EnvConfigurationManager =
    new EnvConfigurationManager();

  private sdkConfigurationManager: SdkConfigurationManager =
    new SdkConfigurationManager();

  async getValue<T>(tenantId: string, key: string): Promise<T | null> {
    return await this.configurationManager().getValue(tenantId, key);
  }

  private configurationManager(): ConfigurationManager {
    switch (process.env.CONFIGURATION_MANAGER_TYPE) {
      case 'ENV':
        return this.envConfigurationManager;
      case 'SDK':
      default:
        return this.sdkConfigurationManager;
    }
  }
}
