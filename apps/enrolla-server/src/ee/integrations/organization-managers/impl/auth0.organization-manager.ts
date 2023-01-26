import { ConfigurationsService } from '../../../../configurations/configurations.service';
import { ManagementClient } from 'auth0';
import { Organization } from '../entities/organization.entity';
import { OrganizationManager } from '../../../../organizations/organization-managers/organization-manager.interface';
import { OrganizationCreateInput } from '../../../../organizations/organization-managers/dto/organization-create.input';
import { Integration } from '../../integration.interface';
import {
  ORGANIZATION_MANAGER_TYPE_CONFIGURATION_KEY,
  ORGANIZATION_MANAGER_TYPE,
  OrganizationManagerType,
  ORGANIZATION_MANAGER_CONFIGURATION_KEY,
  ORGANIZATION_MANAGER_SECRET_CONFIGURATION_KEY,
} from '../constants';
import * as sdk from '@enrolla/node-server-sdk';
import { ConfigureAuth0OrganizationManagerInput } from '../dto';
import { Logger, BadRequestException } from '@nestjs/common';

export class Auth0OrganizationManager
  implements OrganizationManager, Integration
{
  private auth0Clients: Map<string, ManagementClient> = new Map();
  private static logger = new Logger(Auth0OrganizationManager.name);

  constructor(private configurationsService: ConfigurationsService) {}

  async isEnabled(tenantId: string): Promise<boolean> {
    const enabledManager =
      this.configurationsService.getValue<OrganizationManagerType>(
        tenantId,
        ORGANIZATION_MANAGER_TYPE_CONFIGURATION_KEY
      );

    return enabledManager === ORGANIZATION_MANAGER_TYPE.AUTH0;
  }

  async isConfigured(tenantId: string): Promise<boolean> {
    return false;
  }

  async getOrganization(
    tenantId: string,
    organizationId: string
  ): Promise<Organization> {
    if (!(await this.isEnabled(tenantId))) {
      throw new Error('Auth0 integration is disabled');
    }

    return this.getAuth0Client(tenantId).organizations.getByID({
      id: organizationId,
    });
  }

  async getOrganizations(tenantId: string): Promise<Organization[]> {
    if (!(await this.isEnabled(tenantId))) {
      throw new Error('Auth0 integration is disabled');
    }

    return this.getAuth0Client(tenantId).organizations.getAll();
  }

  async createOrganization(
    tenantId: string,
    organizationCreateInput: OrganizationCreateInput
  ): Promise<Organization> {
    if (!(await this.isEnabled(tenantId))) {
      throw new Error('Auth0 integration is disabled');
    }

    return this.getAuth0Client(tenantId).organizations.create({
      name: organizationCreateInput.name,
    });
  }

  async removeOrganization(tenantId: string, organizationId: string) {
    if (!(await this.isEnabled(tenantId))) {
      throw new Error('Auth0 integration is disabled');
    }

    return this.getAuth0Client(tenantId).organizations.delete({
      id: organizationId,
    });
  }

  private getAuth0Client(tenantId: string): ManagementClient {
    if (this.auth0Clients.has(tenantId)) {
      return this.auth0Clients.get(tenantId);
    }

    const config = this.configurationsService.getValue<Record<string, string>>(
      tenantId,
      ORGANIZATION_MANAGER_CONFIGURATION_KEY
    );

    const clientSecret = this.configurationsService.getSecretValue(
      tenantId,
      ORGANIZATION_MANAGER_SECRET_CONFIGURATION_KEY
    );

    const auth0Client = new ManagementClient({
      ...config,
      clientSecret,
    });

    this.auth0Clients.set(tenantId, auth0Client);

    return auth0Client;
  }

  static async configure(
    tenantId: string,
    input: ConfigureAuth0OrganizationManagerInput
  ) {
    await Auth0OrganizationManager.testConfigValidity(input, tenantId);
    const featuresToUpdate = [
      {
        key: ORGANIZATION_MANAGER_TYPE_CONFIGURATION_KEY,
        value: ORGANIZATION_MANAGER_TYPE.AUTH0,
      },
      {
        key: ORGANIZATION_MANAGER_CONFIGURATION_KEY,
        value: {
          clientId: input.clientId,
          domain: input.domain,
        },
      },
    ];
    const secretsToUpdate = [
      {
        key: ORGANIZATION_MANAGER_SECRET_CONFIGURATION_KEY,
        value: input.clientSecret,
      },
    ];
    try {
      await Promise.all([
        sdk.updateCustomerFeatures(tenantId, ...featuresToUpdate),
        sdk.updateCustomerSecrets(tenantId, ...secretsToUpdate),
      ]);

      return true;
    } catch (error) {
      this.logger.error(
        `Failed to configure Auth0 Organization Manager for tenant ${tenantId}.`,
        error.stack
      );

      await sdk.updateCustomerFeatures(tenantId, {
        // fallbak to NONE on error
        key: ORGANIZATION_MANAGER_TYPE_CONFIGURATION_KEY,
        value: ORGANIZATION_MANAGER_TYPE.NONE,
      });

      throw error;
    }
  }

  private static async testConfigValidity(
    input: ConfigureAuth0OrganizationManagerInput,
    tenantId: string
  ) {
    try {
      const auth0Client = new ManagementClient(input);

      await auth0Client.organizations.getAll();
    } catch (error) {
      this.logger.error(
        `Invalid configuration Auth0 Organization manager configuration for tenant: ${tenantId}. Reverting to NONE configuration.`,
        error.stack
      );

      throw new BadRequestException('Invalid configuration');
    }
  }
}
