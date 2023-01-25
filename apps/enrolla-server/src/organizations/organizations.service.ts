import { Injectable, Logger } from '@nestjs/common';
import { CreateOrganizationInput } from './dto/create-organization.input';
import { UpdateOrganizationInput } from './dto/update-organization.input';
import { ConfigurationsService } from '../configurations/configurations.service';
import {
  ORGANIZATION_MANAGER_TYPE,
  OrganizationManager,
  OrganizationManagerType,
} from './organization-managers/organization-manager.interface';
import { ModuleRef } from '@nestjs/core';
import { NoneOrganizationManager } from './organization-managers/none.organization-manager';
import { INTEGRATION_TYPE } from '../ee/integrations/integration.interface';

@Injectable()
export class OrganizationsService {
  private static ORGANIZATION_MANAGER_TYPE_CONFIG_KEY =
    'ORGANIZATION_MANAGER_TYPE';

  private readonly logger = new Logger(OrganizationsService.name);

  constructor(
    private moduleRef: ModuleRef,
    private configurationsService: ConfigurationsService
  ) {}

  async create(
    createOrganizationInput: CreateOrganizationInput,
    tenantId: string
  ) {
    return await this.organizationManager(tenantId).then(
      async (manager) =>
        await manager.createOrganization(tenantId, createOrganizationInput)
    );
  }

  async findAll(tenantId: string) {
    return await this.organizationManager(tenantId).then(
      async (manager) => await manager.getOrganizations(tenantId)
    );
  }

  async findOne(id: string, tenantId: string) {
    return await this.organizationManager(tenantId).then(
      async (manager) => await manager.getOrganization(tenantId, id)
    );
  }

  async update(
    id: string,
    updateOrganizationInput: UpdateOrganizationInput,
    tenantId: string
  ) {
    throw new Error('Not implemented');
  }

  async remove(id: string, tenantId: string) {
    return await this.organizationManager(tenantId).then(
      async (manager) => await manager.removeOrganization(tenantId, id)
    );
  }

  private async organizationManager(
    tenantId: string
  ): Promise<OrganizationManager> {
    let organizationManagerType: OrganizationManagerType;

    try {
      organizationManagerType =
        await this.configurationsService.getValue<OrganizationManagerType>(
          tenantId,
          OrganizationsService.ORGANIZATION_MANAGER_TYPE_CONFIG_KEY
        );
    } catch (error) {
      this.logger.log(
        `Organization manager type not configured for tenant ${tenantId}, falling back to None`
      );

      organizationManagerType = ORGANIZATION_MANAGER_TYPE.None;
    }

    if (organizationManagerType === ORGANIZATION_MANAGER_TYPE.None) {
      return this.moduleRef.get(NoneOrganizationManager);
    }

    if (!process.env.EE) {
      throw new Error(
        'Organization managers is an enterprise edition only feature'
      );
    }

    return this.moduleRef.get(
      `Integration${getIntegrationType(organizationManagerType)}`
    );
  }
}

function getIntegrationType(organizationManagerType: OrganizationManagerType) {
  switch (organizationManagerType) {
    case ORGANIZATION_MANAGER_TYPE.Auth0:
      return INTEGRATION_TYPE.Auth0;

    case ORGANIZATION_MANAGER_TYPE.PropelAuth:
      return INTEGRATION_TYPE.PropelAuth;
  }
}
