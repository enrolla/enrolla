import { ConfigurationsService } from '../../../../configurations/configurations.service';
import { ManagementClient } from 'auth0';
import { Organization } from '../entities/organization.entity';
import { OrganizationManager } from '../organization-manager.interface';
import { OrganizationCreateInput } from '../dto/organization-create.input';

export class Auth0OrganizationManager implements OrganizationManager {
  static readonly AUTH0_CLIENT_ID_CONFIGURATION_KEY = 'auth0_client_id';
  static readonly AUTH0_CLIENT_SECRET_CONFIGURATION_KEY = 'auth0_client_secret';
  static readonly AUTH0_DOMAIN_CONFIGURATION_KEY = 'auth0_domain';

  private auth0Clients: Map<string, ManagementClient> = new Map();

  constructor(private configurationsService: ConfigurationsService) {}

  async getOrganization(
    tenantId: string,
    organizationId: string
  ): Promise<Organization> {
    return await this.getAuth0Client(tenantId).then((managementClient) => {
      return managementClient.organizations.getByID({ id: organizationId });
    });
  }

  async getOrganizations(tenantId: string): Promise<Organization[]> {
    return await this.getAuth0Client(tenantId).then((managementClient) => {
      return managementClient.organizations.getAll();
    });
  }

  async createOrganization(
    tenantId: string,
    organizationCreateInput: OrganizationCreateInput
  ): Promise<Organization> {
    return await this.getAuth0Client(tenantId).then((managementClient) => {
      return managementClient.organizations.create({
        name: organizationCreateInput.name,
      });
    });
  }

  async removeOrganization(tenantId: string, organizationId: string) {
    return await this.getAuth0Client(tenantId).then((managementClient) => {
      return managementClient.organizations.delete({ id: organizationId });
    });
  }

  private async getAuth0Client(tenantId: string): ManagementClient {
    if (this.auth0Clients.has(tenantId)) {
      return this.auth0Clients.get(tenantId);
    }

    const auth0Client = new ManagementClient({
      domain: await this.configurationsService.getValue<string>(
        tenantId,
        Auth0OrganizationManager.AUTH0_DOMAIN_CONFIGURATION_KEY
      ),
      clientId: await this.configurationsService.getValue<string>(
        tenantId,
        Auth0OrganizationManager.AUTH0_CLIENT_ID_CONFIGURATION_KEY
      ),
      clientSecret: await this.configurationsService.getSecretValue(
        tenantId,
        Auth0OrganizationManager.AUTH0_CLIENT_SECRET_CONFIGURATION_KEY
      ),
    });

    this.auth0Clients.set(tenantId, auth0Client);

    return auth0Client;
  }
}
