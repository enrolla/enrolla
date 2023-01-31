import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersResolver } from './customers.resolver';
import { PackagesModule } from '../packages/packages.module';
import { OrganizationsModule } from '../organizations/organizations.module';
import { FeatureInstancesModule } from '../feature-instances/feature-instances.module';
import { SecretsModule } from '../secrets/secrets.module';
import { FeaturesModule } from '../features/features.module';

@Module({
  providers: [CustomersResolver, CustomersService],
  imports: [
    PackagesModule,
    OrganizationsModule,
    FeatureInstancesModule,
    SecretsModule,
    FeaturesModule,
  ],
  exports: [CustomersService],
})
export class CustomersModule {}
