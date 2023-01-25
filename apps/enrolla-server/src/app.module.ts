import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AuthzModule } from './authz/authz.module';
import { FeaturesModule } from './features/features.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PackagesModule } from './packages/packages.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { GraphQLJSON } from 'graphql-scalars';
import { FeatureInstancesModule } from './feature-instances/feature-instances.module';
import { CustomersModule } from './customers/customers.module';
import { OrganizationManagerIntegrationsModule } from './ee/integrations/organization-managers/organization-manager-integrations.module';
import { DatabaseIntegrationsModule } from './ee/integrations/databases/database-integrations.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { ConfigurationsModule } from './configurations/configurations.module';
import { PrismaModule } from './prisma/prisma.module';
import { TenantsModule } from './tenants/tenants.module';
import { SecretsModule } from './secrets/secrets.module';
import { BackOfficeModule } from './backoffice/backoffice.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    EventEmitterModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,

      // See https://www.apollographql.com/docs/apollo-server/v3/performance/cache-backends#ensuring-a-bounded-cache
      cache: 'bounded',

      autoSchemaFile: join(process.cwd(), '/graphql/schema.gql'),
      resolvers: {
        JSON: GraphQLJSON,
      },
      playground: true,
    }),
    AuthzModule,
    PrismaModule,
    FeaturesModule,
    PackagesModule,
    FeatureInstancesModule,
    CustomersModule,
    OrganizationManagerIntegrationsModule.forRoot(),
    DatabaseIntegrationsModule,
    OrganizationsModule,
    ConfigurationsModule,
    TenantsModule,
    SecretsModule,
    BackOfficeModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
