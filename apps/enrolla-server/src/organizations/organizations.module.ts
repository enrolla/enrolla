import { forwardRef, Module } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { OrganizationsResolver } from './organizations.resolver';
import { ConfigurationsModule } from '../configurations/configurations.module';
import { NoneOrganizationManager } from './organization-managers/none.organization-manager';
import { IntegrationsModule } from '../ee/integrations/integrations.module';

@Module({
  providers: [
    OrganizationsResolver,
    OrganizationsService,
    NoneOrganizationManager,
  ],
  imports: [
    ConfigurationsModule,
    forwardRef(() => IntegrationsModule.forRoot()),
  ],
  exports: [OrganizationsService],
})
export class OrganizationsModule {}
