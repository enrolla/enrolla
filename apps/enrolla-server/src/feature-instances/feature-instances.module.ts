import { Module } from '@nestjs/common';
import { FeatureInstancesService } from './feature-instances.service';
import { PrismaService } from '../prisma.service';
import { FeaturesService } from '../features/features.service';
import { PackagesService } from '../packages/packages.service';
import { CustomersService } from '../customers/customers.service';
import { OrganizationsService } from '../organizations/organizations.service';
import { ConfigurationsService } from '../configurations/configurations.service';
import { PackageFeaturesResolver } from './package-features.resolver';
import { CustomerFeaturesResolver } from './customer-features.resolver';

@Module({
  providers: [
    FeatureInstancesService,
    PrismaService,
    FeaturesService,
    PackagesService,
    CustomersService,
    OrganizationsService,
    ConfigurationsService,
    PackageFeaturesResolver,
    CustomerFeaturesResolver,
  ],
})
export class FeatureInstancesModule {}
