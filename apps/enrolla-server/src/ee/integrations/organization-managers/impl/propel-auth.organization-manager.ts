import { ConfigurationsService } from '../../../../configurations/configurations.service';
import { Organization } from '../entities/organization.entity';
import { OrganizationManager } from '../../../../organizations/organization-managers/organization-manager.interface';
import { OrganizationCreateInput } from '../../../../organizations/organization-managers/dto/organization-create.input';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Integration } from '../../integration.interface';

export class PropelAuthOrganizationManager
  implements OrganizationManager, Integration
{
  static readonly PROPEL_AUTH_ENABLED_CONFIGURATION_KEY = 'propel_auth_enabled';
  static readonly PROPEL_AUTH_API_KEY_CONFIGURATION_KEY = 'propel_auth_api_key';
  static readonly PROPEL_AUTH_DOMAIN_CONFIGURATION_KEY = 'propel_auth_domain';

  constructor(
    private configurationsService: ConfigurationsService,
    private httpService: HttpService
  ) {}

  async isEnabled(tenantId: string): Promise<boolean> {
    return await this.configurationsService.getValue(
      tenantId,
      PropelAuthOrganizationManager.PROPEL_AUTH_ENABLED_CONFIGURATION_KEY
    );
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
    return this.configurationsService.getValue<string>(
      tenantId,
      PropelAuthOrganizationManager.PROPEL_AUTH_DOMAIN_CONFIGURATION_KEY
    );
  }

  private tenantApiKey(tenantId: string): string {
    return this.configurationsService.getSecretValue(
      tenantId,
      PropelAuthOrganizationManager.PROPEL_AUTH_API_KEY_CONFIGURATION_KEY
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
}
