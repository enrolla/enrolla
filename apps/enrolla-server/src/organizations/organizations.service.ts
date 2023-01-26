import { Injectable, Logger } from '@nestjs/common';
import { CreateOrganizationInput } from './dto/create-organization.input';
import { UpdateOrganizationInput } from './dto/update-organization.input';
import { OrganizationManager } from './organization-managers/organization-manager.interface';
import { ModuleRef } from '@nestjs/core';
import { NoneOrganizationManager } from './organization-managers/none.organization-manager';
import {
  INTEGRATION_TYPE,
  IntegrationType,
} from '../ee/integrations/integration.interface';
import {
  ORGANIZATION_MANAGER_TYPE_CONFIGURATION_KEY,
  ORGANIZATION_MANAGER_TYPE,
  OrganizationManagerType,
} from './constants';
import * as sdk from '@enrolla/node-server-sdk';

@Injectable()
export class OrganizationsService {
  private readonly logger = new Logger(OrganizationsService.name);

  constructor(private moduleRef: ModuleRef) {}

  async create(
    createOrganizationInput: CreateOrganizationInput,
    tenantId: string
  ) {
    return await this.organizationManager(tenantId).createOrganization(
      tenantId,
      createOrganizationInput
    );
  }

  async findAll(tenantId: string) {
    return await this.organizationManager(tenantId).getOrganizations(tenantId);
  }

  async findOne(id: string, tenantId: string) {
    return await this.organizationManager(tenantId).getOrganization(
      tenantId,
      id
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
    return await this.organizationManager(tenantId).removeOrganization(
      tenantId,
      id
    );
  }

  private organizationManager(tenantId: string): OrganizationManager {
    let organizationManagerType: OrganizationManagerType;

    try {
      organizationManagerType = sdk.getFeatureStringValue(
        ORGANIZATION_MANAGER_TYPE_CONFIGURATION_KEY,
        tenantId
      ) as OrganizationManagerType;
    } catch (error) {
      this.logger.log(
        `Organization manager type not configured for tenant ${tenantId}, falling back to None`
      );

      organizationManagerType = ORGANIZATION_MANAGER_TYPE.NONE;
    }

    if (organizationManagerType === ORGANIZATION_MANAGER_TYPE.NONE) {
      return this.moduleRef.get(NoneOrganizationManager);
    }

    if (!process.env.EE) {
      throw new Error(
        'Organization managers is an enterprise edition only feature'
      );
    }

    return this.moduleRef.get(
      `Integration${getIntegrationType(organizationManagerType)}`,
      { strict: false }
    );
  }
}

function getIntegrationType(
  organizationManagerType: OrganizationManagerType
): IntegrationType {
  switch (organizationManagerType) {
    case ORGANIZATION_MANAGER_TYPE.AUTH0:
      return INTEGRATION_TYPE.Auth0;

    case ORGANIZATION_MANAGER_TYPE.PROPEL_AUTH:
      return INTEGRATION_TYPE.PropelAuth;
  }
}
