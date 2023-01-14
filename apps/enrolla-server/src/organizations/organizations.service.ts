import { Injectable } from '@nestjs/common';
import { CreateOrganizationInput } from './dto/create-organization.input';
import { UpdateOrganizationInput } from './dto/update-organization.input';
import { ConfigurationsService } from '../configurations/configurations.service';
import {
  OrganizationManager,
  OrganizationManagerType,
} from '../integrations/organization-managers/organization-manager.interface';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class OrganizationsService {
  private static ORGANIZATION_MANAGER_TYPE_CONFIG_KEY =
    'ORGANIZATION_MANAGER_TYPE';

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
    const organizationManagerType =
      await this.configurationsService.getValue<OrganizationManagerType>(
        tenantId,
        OrganizationsService.ORGANIZATION_MANAGER_TYPE_CONFIG_KEY
      );

    return this.moduleRef.get(
      `OrganizationManager${organizationManagerType}`
    ) as OrganizationManager;
  }
}
