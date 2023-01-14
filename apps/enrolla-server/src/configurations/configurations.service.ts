import { Injectable } from '@nestjs/common';
import { EnvConfigurationManager } from '../integrations/configuration-managers/impl/env.configuration-manager';
import { ConfigurationManager } from '../integrations/configuration-managers/configuration-manager.interface';
import { SdkConfigurationManager } from '../integrations/configuration-managers/impl/sdk.configuration-manager';

@Injectable()
export class ConfigurationsService implements ConfigurationManager {
  private envConfigurationManager: EnvConfigurationManager =
    new EnvConfigurationManager();

  private sdkConfigurationManager: SdkConfigurationManager =
    new SdkConfigurationManager();

  async getValue<T>(tenantId: string, key: string): Promise<T | null> {
    return await this.sdkConfigurationManager.getValue(tenantId, key);
  }
}
