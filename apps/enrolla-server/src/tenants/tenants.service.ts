import { Injectable } from '@nestjs/common';
import { ManagementClient } from 'auth0';
import { env } from 'process';
import { GithubService } from '../github/github.service';

@Injectable()
export class TenantsService {
  auth0ManagementClient = new ManagementClient({
    domain: env.AUTH0_DOMAIN,
    clientId: env.AUTH0_CLIENT_ID,
    clientSecret: env.AUTH0_CLIENT_SECRET,
  });

  constructor(private githubService: GithubService) {}

  async register(
    userId: string,
    organizationName: string,
    githubInstallationId: number
  ) {
    const organization = this.auth0ManagementClient.organizations.create({
      name: organizationName,
    });

    this.auth0ManagementClient.organizations.addMembers(
      { id: organization.id },
      {
        members: [userId],
      }
    );

    await this.githubService.createOrganization(
      githubInstallationId,
      organization.id
    );
  }
}
