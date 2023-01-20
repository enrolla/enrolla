import { Module } from '@nestjs/common';
import { IntegrationsResolver } from './integrations.resolver';
import { MongoDBService } from './databases/mongodb/mongodb.service';
import { FeaturesModule } from '../../features/features.module';
import { CustomersModule } from '../../customers/customers.module';

@Module({
  providers: [IntegrationsResolver, MongoDBService],
  imports: [FeaturesModule, CustomersModule],
})
export class IntegrationsModule {}
