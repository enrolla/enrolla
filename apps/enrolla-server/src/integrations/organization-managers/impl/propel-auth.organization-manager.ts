import { ConfigurationsService } from '../../../configurations/configurations.service';
import { Organization } from '../entities/organization.entity';
import { OrganizationManager } from '../organization-manager.interface';
import { OrganizationCreateInput } from '../dto/organization-create.input';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

export class PropelAuthOrganizationManager implements OrganizationManager {
  static readonly PROPEL_AUTH_API_KEY_CONGIURATION_KEY = 'propel_auth_api_key';
  static readonly PROPEL_AUTH_DOMAIN_CONGIURATION_KEY = 'propel_auth_domain';

  constructor(
    private configurationsService: ConfigurationsService,
    private httpService: HttpService
  ) {}

  async getOrganization(
    tenantId: string,
    organizationId: string
  ): Promise<Organization> {
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
      PropelAuthOrganizationManager.PROPEL_AUTH_DOMAIN_CONGIURATION_KEY
    );
  }

  private tenantApiKey(tenantId: string): string {
    return this.configurationsService.getSecretValue(
      tenantId,
      PropelAuthOrganizationManager.PROPEL_AUTH_API_KEY_CONGIURATION_KEY
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
