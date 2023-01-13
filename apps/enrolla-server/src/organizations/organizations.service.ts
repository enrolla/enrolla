import { Injectable } from '@nestjs/common';
import { CreateOrganizationInput } from './dto/create-organization.input';
import { UpdateOrganizationInput } from './dto/update-organization.input';
import { ConfigurationsService } from '../configurations/configurations.service';
import { NoneOrganizationManager } from '../integrations/organization-managers/impl/none.organization-manager';
import { Auth0OrganizationManager } from '../integrations/organization-managers/impl/auth0.organization-manager';
import {
  OrganizationManager,
  OrganizationManagerType,
} from '../integrations/organization-managers/organization-manager.interface';

@Injectable()
export class OrganizationsService {
  private static ORGANIZATION_MANAGER_TYPE_CONFIG_KEY =
    'ORGANIZATION_MANAGER_TYPE';

  private noneOrganizationManager = new NoneOrganizationManager();
  private auth0OrganizationManager: Auth0OrganizationManager;

  constructor(private configurationsService: ConfigurationsService) {
    this.auth0OrganizationManager = new Auth0OrganizationManager(
      configurationsService
    );
  }

  async create(
    createOrganizationInput: CreateOrganizationInput,
    tenantId: string
  ) {
    const organizationManager = await this.tenantOrganizationManager(tenantId);

    return await organizationManager.createOrganization(
      tenantId,
      createOrganizationInput
    );
  }

  async findAll(tenantId: string) {
    const organizationManager = await this.tenantOrganizationManager(tenantId);

    return await organizationManager.getOrganizations(tenantId);
  }

  async findOne(id: string, tenantId: string) {
    const organizationManager = await this.tenantOrganizationManager(tenantId);

    return await organizationManager.getOrganization(tenantId, id);
  }

  async update(
    id: string,
    updateOrganizationInput: UpdateOrganizationInput,
    tenantId: string
  ) {
    throw new Error('Not implemented');
  }

  async remove(id: string, tenantId: string) {
    const organizationManager = await this.tenantOrganizationManager(tenantId);

    return await organizationManager.removeOrganization(tenantId, id);
  }

  private async tenantOrganizationManager(
    tenantId: string
  ): Promise<OrganizationManager | null> {
    const organizationManagerType =
      await this.configurationsService.getValue<OrganizationManagerType>(
        tenantId,
        OrganizationsService.ORGANIZATION_MANAGER_TYPE_CONFIG_KEY
      );

    switch (organizationManagerType || OrganizationManagerType.None) {
      case OrganizationManagerType.None:
        return this.noneOrganizationManager;

      case OrganizationManagerType.Auth0:
        return this.auth0OrganizationManager;
      default:
        throw new Error(
          `Organization manager type ${organizationManagerType} not supported`
        );
    }
  }
}
