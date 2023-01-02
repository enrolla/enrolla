import { ConfigurationsService } from '../../../configurations/configurations.service';
import { ManagementClient } from 'auth0';
import { Organization } from '../entities/organization.entity';
import { OrganizationManager } from '../organization-manager.interface';
import { OrganizationCreateInput } from '../dto/organization-create.input';

export class Auth0OrganizationManager implements OrganizationManager {
  static AUTH0_CLIENT_ID_CONGIURATION_KEY = 'auth0_client_id';
  static AUTH0_CLIENT_SECRET_CONGIURATION_KEY = 'auth0_client_secret';
  static AUTH0_DOMAIN_CONGIURATION_KEY = 'auth0_domain';

  private auth0Clients: Map<string, ManagementClient> = new Map();

  constructor(private configurationsService: ConfigurationsService) {}

  async getOrganization(
    tenantId: string,
    organizationId: string
  ): Promise<Organization> {
    const managementClient = await this.getAuth0Client(tenantId);

    return await managementClient.organizations.getByID({ id: organizationId });
  }

  async getOrganizations(tenantId: string): Promise<Organization[]> {
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

    return await managementClient.organizations.delete({ id: organizationId });
  }

  private async getAuth0Client(tenantId: string): ManagementClient {
    if (this.auth0Clients.has(tenantId)) {
      return this.auth0Clients.get(tenantId);
    }

    const domain = await this.configurationsService.getValue<string>(
      tenantId,
      Auth0OrganizationManager.AUTH0_DOMAIN_CONGIURATION_KEY
    );

    const clientId = await this.configurationsService.getValue<string>(
      tenantId,
      Auth0OrganizationManager.AUTH0_CLIENT_ID_CONGIURATION_KEY
    );

    const clientSecret = await this.configurationsService.getValue<string>(
      tenantId,
      Auth0OrganizationManager.AUTH0_CLIENT_SECRET_CONGIURATION_KEY
    );

    const auth0Client = new ManagementClient({
      domain,
      clientId,
      clientSecret,
    });

    this.auth0Clients.set(tenantId, auth0Client);

    return auth0Client;
  }
}
