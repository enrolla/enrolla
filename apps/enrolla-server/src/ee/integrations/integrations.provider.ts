import { Provider } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import {
  Integration,
  IntegrationType,
  INTEGRATION_TYPE,
} from './integration.interface';
import { ConfigurationsService } from '../../configurations/configurations.service';
import {
  Auth0OrganizationManager,
  PropelAuthOrganizationManager,
} from './organization-managers/impl';

function integrationFactory(
  configurationsService: ConfigurationsService,
  httpService: HttpService,
  type: IntegrationType
) {
  switch (type) {
    case INTEGRATION_TYPE.Auth0:
      return new Auth0OrganizationManager(configurationsService);
    case INTEGRATION_TYPE.PropelAuth:
      return new PropelAuthOrganizationManager(
        configurationsService,
        httpService
      );
  }
}

function createIntegrationProvider(type: string): Provider<Integration> {
  return {
    provide: `Integration${type}`,
    useFactory: (configurationsService, httpService) =>
      integrationFactory(
        configurationsService,
        httpService,
        INTEGRATION_TYPE[type]
      ),
    inject: [ConfigurationsService, HttpService],
  };
}

export function createIntegrationsProviders(): Array<Provider<Integration>> {
  return Object.values(INTEGRATION_TYPE).map((type) =>
    createIntegrationProvider(type)
  );
}
