import { Injectable, Logger } from '@nestjs/common';
import * as sdk from '@enrolla/node-server-sdk';
import { ConfigureAuth0OrganizationManagerInput, ConfigurePropelauthOrganizationManagerInput } from './dto';

@Injectable()
export class OrganizationManagerService {
  private readonly logger = new Logger(OrganizationManagerService.name);

  constructor() {}

  async configureAuth0Integration(
    tenantId: string,
    input: ConfigureAuth0OrganizationManagerInput
  ) {
    const AUTH0_ENABLED_CONFIGURATION_KEY = 'auth0';
    const AUTH0_CLIENT_ID_CONFIGURATION_KEY = 'auth0_client_id';
    const AUTH0_CLIENT_SECRET_CONFIGURATION_KEY = 'auth0_client_secret';
    const AUTH0_DOMAIN_CONFIGURATION_KEY = 'auth0_domain';

    const featuresToUpdate = [
      { key: AUTH0_ENABLED_CONFIGURATION_KEY, value: true },
      { key: AUTH0_CLIENT_ID_CONFIGURATION_KEY, value: input.clientId },
      { key: AUTH0_DOMAIN_CONFIGURATION_KEY, value: input.domain },
    ];
    const secretsToUpdate = [
      { key: AUTH0_CLIENT_SECRET_CONFIGURATION_KEY, value: input.clientSecret },
    ];
    try {
      await Promise.all([
        sdk.updateCustomerFeatures(tenantId, ...featuresToUpdate),
        sdk.updateCustomerSecrets(tenantId, ...secretsToUpdate),
      ]);
    } catch (error) {
      this.logger.error(
        `Failed to configure Auth0 Organization Manager for tennat ${tenantId}`,
        error.stack
      );
      await sdk.updateCustomerFeatures(tenantId, { // set integration to disabled
        key: AUTH0_ENABLED_CONFIGURATION_KEY,
        value: false,
      });
      throw error;
    }
  }

  async configurePropelauthIntegration(
    tenantId: string,
    input: ConfigurePropelauthOrganizationManagerInput
    ) {
        const PROPELAUTH_ENABLED_CONFIGURATION_KEY = 'propelauth';
        const PROPEL_AUTH_API_KEY_CONGIURATION_KEY = 'propel_auth_api_key';
        const PROPEL_AUTH_DOMAIN_CONGIURATION_KEY = 'propel_auth_domain';

        const featuresToUpdate = [
            { key: PROPELAUTH_ENABLED_CONFIGURATION_KEY, value: true },
            { key: PROPEL_AUTH_DOMAIN_CONGIURATION_KEY, value: input.domain },
        ];
        const secretsToUpdate = [
            { key: PROPEL_AUTH_API_KEY_CONGIURATION_KEY, value: input.apiKey },
        ];
        try {
            await Promise.all([
                sdk.updateCustomerFeatures(tenantId, ...featuresToUpdate),
                sdk.updateCustomerSecrets(tenantId, ...secretsToUpdate),
            ]);
        }
        catch (error) {
            this.logger.error(
                `Failed to configure Propelauth Organization Manager for tennat ${tenantId}`,
                error.stack
            );
            await sdk.updateCustomerFeatures(tenantId, { // set integration to disabled
                key: PROPELAUTH_ENABLED_CONFIGURATION_KEY,
                value: false,
            });
            throw error;
        }
    }
}
