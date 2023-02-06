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
import { IntegrationsModule } from './ee/integrations/integrations.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { ConfigurationsModule } from './configurations/configurations.module';
import { PrismaModule } from './prisma/prisma.module';
import { TenantsModule } from './tenants/tenants.module';
import { SecretsModule } from './secrets/secrets.module';
import { BackOfficeModule } from './backoffice/backoffice.module';
import { graphqlWsOnConnect } from './authz/subscription-on-connect';

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
      debug: true,
      subscriptions: {
        'graphql-ws': {
          onConnect: graphqlWsOnConnect,
        },
        'subscriptions-transport-ws': false,
      },
      context: ({ extra }) => {
        return { tenantId: extra?.tenantId };
      },
    }),
    AuthzModule,
    PrismaModule,
    FeaturesModule,
    PackagesModule,
    FeatureInstancesModule,
    CustomersModule,
    IntegrationsModule,
    OrganizationsModule,
    ConfigurationsModule,
    TenantsModule,
    SecretsModule,
    BackOfficeModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
