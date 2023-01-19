import { OrganizationCreateInput } from '../dto/organization-create.input';
import { Organization } from '../entities/organization.entity';
import { OrganizationManager } from '../organization-manager.interface';

export class NoneOrganizationManager implements OrganizationManager {
  async getOrganization(
    tenantId: string,
    organizationId: string
  ): Promise<Organization> {
    return { id: organizationId, name: organizationId };
  }

  async getOrganizations(): Promise<Organization[]> {
    return [];
  }

  async createOrganization(
    tenantId: string,
    organizationCreateInput: OrganizationCreateInput
  ): Promise<Organization> {
    return {
      id: organizationCreateInput.name,
      name: organizationCreateInput.name,
    };
  }

  async removeOrganization() {
    throw new Error(
      'None organization manager does not support removing organizations'
    );
  }
}
