import { ConfigurationsService } from '../../../configurations/configurations.service';
import { ManagementClient } from 'auth0';

export class Auth0OrganizationManager implements OrganizationManager {
  static AUTH0_TOKEN_CONGIURATION_KEY = 'auth0_token';
  static AUTH0_DOMAIN_CONGIURATION_KEY = 'auth0_domain';

  private auth0Clients: Map<string, ManagementClient> = new Map();

  constructor(private configurationsService: ConfigurationsService) {}

  async getOrganization(
    organizationId: string,
    tenantId: string
  ): Promise<Organization> {
    const managementClient = await this.getAuth0Client(tenantId);

    return await managementClient.organizations.getByID({ id: organizationId });
  }

  async getOrganizations(tenantId: string): Promise<Organization[]> {
    console.log('getOrganizations', tenantId);
    const managementClient = await this.getAuth0Client(tenantId);

    return await managementClient.organizations.getAll();
  }

  async createOrganization(
    tenantId: string,
    organizationCreateInput: OrganizationCreateInput
  ): Promise<Organization> {
    const managementClient = await this.getAuth0Client(tenantId);

    return await managementClient.organizations.create({
      name: organizationCreateInput.name,
    });
  }

  async removeOrganization(tenantId: string, organizationId: string) {
    const managementClient = await this.getAuth0Client(tenantId);

    return await managementClient.organizations.delete(organizationId);
  }

  private async getAuth0Client(tenantId: string): ManagementClient {
    if (this.auth0Clients.has(tenantId)) {
      return this.auth0Clients.get(tenantId);
    }

    const domain = await this.configurationsService.getValue<string>(
      tenantId,
      Auth0OrganizationManager.AUTH0_DOMAIN_CONGIURATION_KEY
    );
    const token = await this.configurationsService.getValue<string>(
      tenantId,
      Auth0OrganizationManager.AUTH0_TOKEN_CONGIURATION_KEY
    );

    const auth0Client = new ManagementClient({
      domain,
      token,
    });

    this.auth0Clients.set(tenantId, auth0Client);

    return auth0Client;
  }
}
