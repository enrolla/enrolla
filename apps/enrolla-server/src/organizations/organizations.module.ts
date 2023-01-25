import { forwardRef, Module } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { OrganizationsResolver } from './organizations.resolver';
import { ConfigurationsModule } from '../configurations/configurations.module';
import { NoneOrganizationManager } from './organization-managers/none.organization-manager';
import { OrganizationManagerIntegrationsModule } from '../ee/integrations/organization-managers/organization-manager-integrations.module';

@Module({
  providers: [
    OrganizationsResolver,
    OrganizationsService,
    NoneOrganizationManager,
  ],
  imports: [
    ConfigurationsModule,
    OrganizationManagerIntegrationsModule.forRoot(),
  ],
  exports: [OrganizationsService],
})
export class OrganizationsModule {}
