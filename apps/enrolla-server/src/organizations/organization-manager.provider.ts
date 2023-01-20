import { Provider } from '@nestjs/common';
import {
  OrganizationManager,
  OrganizationManagerType,
} from '../ee/integrations/organization-managers/organization-manager.interface';
import { ConfigurationsService } from '../configurations/configurations.service';
import { NoneOrganizationManager } from '../ee/integrations/organization-managers/impl/none.organization-manager';
import { Auth0OrganizationManager } from '../ee/integrations/organization-managers/impl/auth0.organization-manager';
import { PropelAuthOrganizationManager } from '../ee/integrations/organization-managers/impl/propel-auth.organization-manager';
import { HttpService } from '@nestjs/axios';

function organizationManagerFactory(
  configurationsService: ConfigurationsService,
  httpService: HttpService,
  type: OrganizationManagerType
) {
  switch (type) {
    case OrganizationManagerType.Auth0:
      return new Auth0OrganizationManager(configurationsService);
    case OrganizationManagerType.PropelAuth:
      return new PropelAuthOrganizationManager(
        configurationsService,
        httpService
      );
    case OrganizationManagerType.None:
    default:
      return new NoneOrganizationManager();
  }
}

function createOrganizationManagerProvider(
  type: string
): Provider<OrganizationManager> {
  return {
    provide: `OrganizationManager${type}`,
    useFactory: (configurationsService, httpService) =>
      organizationManagerFactory(
        configurationsService,
        httpService,
        OrganizationManagerType[type]
      ),
    inject: [ConfigurationsService, HttpService],
  };
}

export function createOrganizationManagerProviders(): Array<
  Provider<OrganizationManager>
> {
  return Object.keys(OrganizationManagerType).map((type) =>
    createOrganizationManagerProvider(type)
  );
}
