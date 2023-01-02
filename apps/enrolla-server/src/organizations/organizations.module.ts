import { Module } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { OrganizationsResolver } from './organizations.resolver';
import { ConfigurationsService } from '../configurations/configurations.service';

@Module({
  providers: [
    OrganizationsResolver,
    OrganizationsService,
    ConfigurationsService,
  ],
})
export class OrganizationsModule {}
