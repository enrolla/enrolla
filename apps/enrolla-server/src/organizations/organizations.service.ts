import { Injectable, Logger } from '@nestjs/common';
import { CreateOrganizationInput } from './dto/create-organization.input';
import { UpdateOrganizationInput } from './dto/update-organization.input';
import { ConfigurationsService } from '../configurations/configurations.service';
import {
  OrganizationManager,
  OrganizationManagerType,
} from './organization-managers/organization-manager.interface';
import { ModuleRef } from '@nestjs/core';
import { NoneOrganizationManager } from './organization-managers/none.organization-manager';
import { IntegrationType } from '../ee/integrations/integration.interface';

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

      organizationManagerType = OrganizationManagerType.None;
    }

    if (organizationManagerType === OrganizationManagerType.None) {
      return this.moduleRef.get(NoneOrganizationManager);
    }

    if (!process.env.EE) {
      throw new Error(
        'Organization managers is an enterprise edition only feature'
      );
    }

    return this.moduleRef.get(
      `Integration${
        IntegrationType[getIntegrationType(organizationManagerType)]
      }`,
      { strict: false }
    );
  }
}

function getIntegrationType(organizationManagerType: OrganizationManagerType) {
  switch (organizationManagerType) {
    case OrganizationManagerType.Auth0:
      return IntegrationType.Auth0;

    case OrganizationManagerType.PropelAuth:
      return IntegrationType.PropelAuth;
  }
}
