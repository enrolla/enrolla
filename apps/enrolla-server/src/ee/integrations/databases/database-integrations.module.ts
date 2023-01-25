import { Module } from '@nestjs/common';
import { MongoDBCustomersService } from './mongodb/mongodb-customers.service';
import { FeaturesModule } from '../../../features/features.module';
import { CustomersModule } from '../../../customers/customers.module';
import { DatabaseIntegrationsResolver } from './database-integrations.resolver';

@Module({
  providers: [DatabaseIntegrationsResolver, MongoDBCustomersService],
  imports: [FeaturesModule, CustomersModule],
})
export class DatabaseIntegrationsModule {}
