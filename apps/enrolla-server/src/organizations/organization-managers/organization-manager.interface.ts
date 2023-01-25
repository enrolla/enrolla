import { OrganizationCreateInput } from './dto/organization-create.input';
import { Organization } from '../../ee/integrations/organization-managers/entities/organization.entity';

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

export enum OrganizationManagerType {
  None = 'NONE',
  Auth0 = 'AUTH0',
  PropelAuth = 'PROPEL_AUTH',
}
