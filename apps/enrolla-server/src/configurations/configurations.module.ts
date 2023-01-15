import { Module } from '@nestjs/common';
import { ConfigurationsService } from './configurations.service';
import { SdkConfigurationManager } from './configuration-managers/impl/sdk.configuration-manager';
import { EnvConfigurationManager } from './configuration-managers/impl/env.configuration-manager';

const configurationManagerProvider = {
  provide: 'ConfigurationManager',
  useClass:
    process.env.CONFIGURATION_MANAGER_TYPE === 'ENV'
      ? EnvConfigurationManager
      : SdkConfigurationManager,
};

@Module({
  providers: [ConfigurationsService, configurationManagerProvider],
  exports: [ConfigurationsService],
})
export class ConfigurationsModule {}
