import { DynamicModule, Module } from '@nestjs/common';
import { createIntegrationsProviders } from './integrations.provider';
import { ConfigurationsModule } from '../../../configurations/configurations.module';
import { HttpModule } from '@nestjs/axios';

const integrationsProviders = createIntegrationsProviders();

@Module({})
export class OrganizationManagerIntegrationsModule {
  static forRoot(): DynamicModule {
    if (process.env.EE) {
      return {
        module: OrganizationManagerIntegrationsModule,
        providers: [...integrationsProviders],
        imports: [ConfigurationsModule, HttpModule],
      };
    } else {
      return { module: OrganizationManagerIntegrationsModule };
    }
  }
}
