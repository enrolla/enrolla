import { Module } from '@nestjs/common';
import { IntegrationsResolver } from './integrations.resolver';
import { MongoDBCustomersService } from './databases/mongodb/mongodb-customers.service';
import { FeaturesModule } from '../../features/features.module';
import { CustomersModule } from '../../customers/customers.module';

@Module({
  providers: [IntegrationsResolver, MongoDBCustomersService],
  imports: [FeaturesModule, CustomersModule],
})
export class IntegrationsModule {}
