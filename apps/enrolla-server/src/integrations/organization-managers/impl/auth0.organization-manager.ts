import { ConfigurationsService } from '../../../configurations/configurations.service';
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
    return this.getAuth0Client(tenantId).organizations.getByID({
      id: organizationId,
    });
  }

  async getOrganizations(tenantId: string): Promise<Organization[]> {
    return this.getAuth0Client(tenantId).organizations.getAll();
  }

  async createOrganization(
    tenantId: string,
    organizationCreateInput: OrganizationCreateInput
  ): Promise<Organization> {
    return this.getAuth0Client(tenantId).organizations.create({
      name: organizationCreateInput.name,
    });
  }

  async removeOrganization(tenantId: string, organizationId: string) {
    return this.getAuth0Client(tenantId).organizations.delete({
      id: organizationId,
    });
  }

  private getAuth0Client(tenantId: string): ManagementClient {
    if (this.auth0Clients.has(tenantId)) {
      return this.auth0Clients.get(tenantId);
    }

    const auth0Client = new ManagementClient({
      domain: this.configurationsService.getValue<string>(
        tenantId,
        Auth0OrganizationManager.AUTH0_DOMAIN_CONFIGURATION_KEY
      ),
      clientId: this.configurationsService.getValue<string>(
        tenantId,
        Auth0OrganizationManager.AUTH0_CLIENT_ID_CONFIGURATION_KEY
      ),
      clientSecret: this.configurationsService.getSecretValue(
        tenantId,
        Auth0OrganizationManager.AUTH0_CLIENT_SECRET_CONFIGURATION_KEY
      ),
    });

    this.auth0Clients.set(tenantId, auth0Client);

    return auth0Client;
  }
}
