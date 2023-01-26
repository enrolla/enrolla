import { ConfigurationsService } from '../../../../configurations/configurations.service';
import { Organization } from '../entities/organization.entity';
import { OrganizationManager } from '../../../../organizations/organization-managers/organization-manager.interface';
import { OrganizationCreateInput } from '../../../../organizations/organization-managers/dto/organization-create.input';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Integration } from '../../integration.interface';
import {
  ORGANIZATION_MANAGER_TYPE_CONFIGURATION_KEY,
  ORGANIZATION_MANAGER_TYPE,
  OrganizationManagerType,
  ORGANIZATION_MANAGER_CONFIGURATION_KEY,
  ORGANIZATION_MANAGER_SECRET_CONFIGURATION_KEY,
} from '../constants';
import { ConfigurePropelauthOrganizationManagerInput } from '../dto';
import * as sdk from '@enrolla/node-server-sdk';
import { Logger, BadRequestException } from '@nestjs/common';
import axios from 'axios';

export class PropelAuthOrganizationManager
  implements OrganizationManager, Integration
{
  private static logger = new Logger(PropelAuthOrganizationManager.name);

  constructor(
    private configurationsService: ConfigurationsService,
    private httpService: HttpService
  ) {}

  async isEnabled(tenantId: string): Promise<boolean> {
    const enabledManager =
      this.configurationsService.getValue<OrganizationManagerType>(
        tenantId,
        ORGANIZATION_MANAGER_TYPE_CONFIGURATION_KEY
      );

    return enabledManager === ORGANIZATION_MANAGER_TYPE.PROPEL_AUTH;
  }

  async isConfigured(tenantId: string): Promise<boolean> {
    return false;
  }

  async getOrganization(
    tenantId: string,
    organizationId: string
  ): Promise<Organization> {
    if (!(await this.isEnabled(tenantId))) {
      throw new Error('PropelAuth integration is disabled');
    }

    const response = await firstValueFrom(
      this.httpService.get(
        this.tenantRequestUrl(
          tenantId,
          `/api/backend/v1/org/${organizationId}`
        ),
        { headers: this.tenantHeaders(tenantId) }
      )
    );

    return { id: response.data.org_id, name: response.data.name };
  }

  async getOrganizations(tenantId: string): Promise<Organization[]> {
    let hasMore = true;
    let page = 0;
    const organizations = [];

    if (!(await this.isEnabled(tenantId))) {
      throw new Error('PropelAuth integration is disabled');
    }

    while (hasMore) {
      const response = await firstValueFrom(
        this.httpService.get(
          this.tenantRequestUrl(tenantId, '/api/backend/v1/org/query'),
          {
            params: {
              current_page: page,
              page_size: 100,
            },
            headers: this.tenantHeaders(tenantId),
          }
        )
      );

      response.data.orgs.forEach((org) => {
        organizations.push({ id: org.org_id, name: org.name });
      });

      hasMore = response.data.has_more_results;
      page++;
    }

    return organizations;
  }

  async createOrganization(
    tenantId: string,
    organizationCreateInput: OrganizationCreateInput
  ): Promise<Organization> {
    if (!(await this.isEnabled(tenantId))) {
      throw new Error('PropelAuth is disabled');
    }

    const response = await firstValueFrom(
      this.httpService.post(
        this.tenantRequestUrl(tenantId, '/api/backend/v1/org/'),
        {
          name: organizationCreateInput.name,
        },
        { headers: this.tenantHeaders(tenantId) }
      )
    );

    return { id: response.data.org_id, name: organizationCreateInput.name };
  }

  async removeOrganization(tenantId: string, organizationId: string) {
    throw new Error('Method not implemented.');
  }

  private tenantDomain(tenantId: string): string {
    return this.configurationsService.getValue<Record<string, string>>(
      tenantId,
      ORGANIZATION_MANAGER_CONFIGURATION_KEY
    ).domain;
  }

  private tenantApiKey(tenantId: string): string {
    return this.configurationsService.getSecretValue(
      tenantId,
      ORGANIZATION_MANAGER_SECRET_CONFIGURATION_KEY
    );
  }

  private tenantHeaders(tenantId: string) {
    return {
      Authorization: `Bearer ${this.tenantApiKey(tenantId)}`,
    };
  }

  private tenantRequestUrl(tenantId: string, path: string) {
    return `${this.tenantDomain(tenantId)}/${path}`;
  }

  static async configure(
    tenantId: string,
    input: ConfigurePropelauthOrganizationManagerInput
  ) {
    this.testConfigValidity(input);
    const featuresToUpdate = [
      {
        key: ORGANIZATION_MANAGER_TYPE_CONFIGURATION_KEY,
        value: ORGANIZATION_MANAGER_TYPE.PROPEL_AUTH,
      },
      {
        key: ORGANIZATION_MANAGER_CONFIGURATION_KEY,
        value: {
          domain: input.domain,
        },
      },
    ];
    const secretsToUpdate = [
      {
        key: ORGANIZATION_MANAGER_SECRET_CONFIGURATION_KEY,
        value: input.apiKey,
      },
    ];
    try {
      await Promise.all([
        sdk.updateCustomerFeatures(tenantId, ...featuresToUpdate),
        sdk.updateCustomerSecrets(tenantId, ...secretsToUpdate),
      ]);

      return true;
    } catch (error) {
      this.logger.error(
        `Failed to configure Propelauth Organization Manager for tennat ${tenantId}. Reverting to NONE configuration.`,
        error.stack
      );
      await sdk.updateCustomerFeatures(tenantId, {
        // fallbak to NONE on error
        key: ORGANIZATION_MANAGER_TYPE_CONFIGURATION_KEY,
        value: ORGANIZATION_MANAGER_TYPE.NONE,
      });

      throw error;
    }
  }

  private static async testConfigValidity(
    input: ConfigurePropelauthOrganizationManagerInput
  ) {
    try {
      await axios.get(`${input.domain}/api/backend/v1/org/query`, {
        params: {
          current_page: 0,
          page_size: 1,
        },
        headers: {
          Authorization: `Bearer ${input.apiKey}`,
        },
      });
    } catch (error) {
      this.logger.error(
        `Invalid configuration PropelAuth Organization manager configuration for tenant: ${tenantId}.`,
        error.stack
      );

      throw new BadRequestException('Invalid configuration');
    }
  }
}
