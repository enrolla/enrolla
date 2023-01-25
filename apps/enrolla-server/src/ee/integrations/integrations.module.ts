import { forwardRef, Module } from '@nestjs/common';
import { IntegrationsResolver } from './integrations.resolver';
import { MongoDBCustomersService } from './databases/mongodb/mongodb-customers.service';
import { FeaturesModule } from '../../features/features.module';
import { CustomersModule } from '../../customers/customers.module';
import { createIntegrationsProviders } from './integrations.provider';
import { ConfigurationsModule } from '../../configurations/configurations.module';
import { HttpModule } from '@nestjs/axios';

const providers = [];
if (process.env.EE) {
  providers.push(
    IntegrationsResolver,
    MongoDBCustomersService,
    ...createIntegrationsProviders()
  );
}

@Module({
  providers,
  imports: [
    forwardRef(() => FeaturesModule),
    forwardRef(() => CustomersModule),
    ConfigurationsModule,
    HttpModule,
  ],
})
export class IntegrationsModule {}
