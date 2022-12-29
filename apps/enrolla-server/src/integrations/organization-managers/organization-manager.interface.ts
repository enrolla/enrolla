interface OrganizationManager {
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
