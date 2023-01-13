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
import { IntegrationsModule } from './integrations/integrations.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { ConfigurationsModule } from './configurations/configurations.module';
import { PrismaModule } from './prisma/prisma.module';
import { TenantsModule } from './tenants/tenants.module';
import { SecretsModule } from './secrets/secrets.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    EventEmitterModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'apps/enrolla-server/src/schema.gql'),
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
    IntegrationsModule,
    OrganizationsModule,
    ConfigurationsModule,
    TenantsModule,
    SecretsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
