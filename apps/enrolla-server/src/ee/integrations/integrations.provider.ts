import { Provider } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Integration, IntegrationType } from './integration.interface';
import { ConfigurationsService } from '../../configurations/configurations.service';
import { Auth0OrganizationManager } from './organization-managers/impl/auth0.organization-manager';
import { PropelAuthOrganizationManager } from './organization-managers/impl/propel-auth.organization-manager';
import { isNumber } from 'class-validator';

function integrationFactory(
  configurationsService: ConfigurationsService,
  httpService: HttpService,
  type: IntegrationType
) {
  switch (type) {
    case IntegrationType.Auth0:
      return new Auth0OrganizationManager(configurationsService);
    case IntegrationType.PropelAuth:
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
        IntegrationType[type]
      ),
    inject: [ConfigurationsService, HttpService],
  };
}

export function createIntegrationsProviders(): Array<Provider<Integration>> {
  return Object.keys(IntegrationType)
    .filter((k) => !isNumber(k))
    .map((type) => createIntegrationProvider(type));
}
