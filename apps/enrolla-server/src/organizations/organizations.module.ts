import { Module } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { OrganizationsResolver } from './organizations.resolver';
import { ConfigurationsModule } from '../configurations/configurations.module';

@Module({
  providers: [OrganizationsResolver, OrganizationsService],
  imports: [ConfigurationsModule],
  exports: [OrganizationsService],
})
export class OrganizationsModule {}
