import { Provider } from '@nestjs/common';
import {
  OrganizationManager,
  OrganizationManagerType,
} from '../integrations/organization-managers/organization-manager.interface';
import { ConfigurationsService } from '../configurations/configurations.service';
import { NoneOrganizationManager } from '../integrations/organization-managers/impl/none.organization-manager';
import { Auth0OrganizationManager } from '../integrations/organization-managers/impl/auth0.organization-manager';
import { PropelAuthOrganizationManager } from '../integrations/organization-managers/impl/propel-auth.organization-manager';

function organizationManagerFactory(
  configurationsService: ConfigurationsService,
  type: OrganizationManagerType
) {
  switch (type) {
    case OrganizationManagerType.Auth0:
      return new Auth0OrganizationManager(configurationsService);
    case OrganizationManagerType.PropelAuth:
      return new PropelAuthOrganizationManager(configurationsService);
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
    useFactory: (configurationsService) =>
      organizationManagerFactory(
        configurationsService,
        OrganizationManagerType[type]
      ),
    inject: [ConfigurationsService],
  };
}

export function createOrganizationManagerProviders(): Array<
  Provider<OrganizationManager>
> {
  return Object.keys(OrganizationManagerType).map((type) =>
    createOrganizationManagerProvider(type)
  );
}
