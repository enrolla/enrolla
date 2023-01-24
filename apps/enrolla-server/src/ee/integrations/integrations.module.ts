import { DynamicModule, Module } from '@nestjs/common';
import { IntegrationsResolver } from './integrations.resolver';
import { MongoDBCustomersService } from './databases/mongodb/mongodb-customers.service';
import { FeaturesModule } from '../../features/features.module';
import { CustomersModule } from '../../customers/customers.module';
import { createIntegrationsProviders } from './integrations.provider';
import { ConfigurationsModule } from '../../configurations/configurations.module';
import { HttpModule } from '@nestjs/axios';

const integrationsProviders = createIntegrationsProviders();

@Module({})
export class IntegrationsModule {
  static register(): DynamicModule {
    if (process.env.EE) {
      return {
        module: IntegrationsModule,
        providers: [
          IntegrationsResolver,
          MongoDBCustomersService,
          ...integrationsProviders,
        ],
        imports: [
          FeaturesModule,
          CustomersModule,
          ConfigurationsModule,
          HttpModule,
        ],
      };
    } else {
      return { module: IntegrationsModule };
    }
  }
}
