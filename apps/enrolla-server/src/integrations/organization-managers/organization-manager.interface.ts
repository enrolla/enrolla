import { OrganizationCreateInput } from './dto/organization-create.input';
import { Organization } from './entities/organization.entity';

export interface OrganizationManager {
  getOrganization(
    tenantId: string,
    organizationId: string
  ): Promise<Organization>;
  getOrganizations(tenantId: string): Promise<Organization[]>;
  createOrganization(
    tenantId: string,
    tenantCreateInput: OrganizationCreateInput
  ): Promise<Organization>;
  removeOrganization(tenantId: string, organizationId: string): Promise<void>;
}
