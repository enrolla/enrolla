import { Module } from '@nestjs/common';
import { IntegrationsResolver } from './integrations.resolver';
import { MongoDBCustomersService } from './databases/mongodb/mongodb-customers.service';
import { FeaturesModule } from '../../features/features.module';
import { CustomersModule } from '../../customers/customers.module';
import { PostgresQLCustomersService } from './databases/postgresql/postgresql-customers.service';
import { ExternalCustomersService } from './databases/external-customers.service';

@Module({
  providers: [
    IntegrationsResolver,
    MongoDBCustomersService,
    PostgresQLCustomersService,
    ExternalCustomersService,
  ],
  imports: [FeaturesModule, CustomersModule],
})
export class IntegrationsModule {}
