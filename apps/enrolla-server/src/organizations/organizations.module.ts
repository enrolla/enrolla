import { Module } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { OrganizationsResolver } from './organizations.resolver';
import { ConfigurationsModule } from '../configurations/configurations.module';
import { createOrganizationManagerProviders } from './organization-manager.provider';

const organizationManagerProviders = createOrganizationManagerProviders();

@Module({
  providers: [
    OrganizationsResolver,
    OrganizationsService,
    ...organizationManagerProviders,
  ],
  imports: [ConfigurationsModule],
  exports: [OrganizationsService],
})
export class OrganizationsModule {}
