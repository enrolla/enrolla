import { Module, Logger } from '@nestjs/common';
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
import { Context } from 'graphql-ws';
import { ApiTokenService } from './tenants/api-tokens/service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    EventEmitterModule.forRoot(),
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
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [TenantsModule],
      inject: [ApiTokenService],
      useFactory: (apiTokenService: ApiTokenService) => {
        const logger = new Logger('GraphQL Subscriptions Auth');
        const validate = async (jwt: string) =>
          await apiTokenService.validate(jwt);

        return {
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
              onConnect: async (context: Context<any>) => {
                const extra = context.extra as any;
                const authHeader = extra?.request.headers['authorization'];
                try {
                  const { tenantId } = await validate(
                    authHeader?.split(' ')?.[1]
                  );

                  extra.tenantId = tenantId;
                } catch (error) {
                  logger.error('Failed to validate JWT', error?.stack);
                }
              },
              'subscriptions-transport-ws': false,
            },
            context: ({ extra }) => {
              return { tenantId: extra?.tenantId };
            },
          },
        };
      },
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
