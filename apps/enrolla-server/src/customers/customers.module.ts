import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersResolver } from './customers.resolver';
import { OrganizationsService } from '../organizations/organizations.service';
import { PrismaService } from '../prisma.service';
import { ConfigurationsService } from '../configurations/configurations.service';
import { FeatureInstancesService } from '../feature-instances/feature-instances.service';
import { PackagesModule } from '../packages/packages.module';

@Module({
  providers: [
    CustomersResolver,
    CustomersService,
    OrganizationsService,
    ConfigurationsService,
    PrismaService,
    FeatureInstancesService,
  ],
  imports: [PackagesModule],
})
export class CustomersModule {}
