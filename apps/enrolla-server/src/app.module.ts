import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AuthzModule } from './authz/authz.module';
import { PrismaService } from './prisma.service';
import { FeaturesModule } from './features/features.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PackagesModule } from './packages/packages.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { GraphQLJSON } from 'graphql-scalars';
import { FeatureInstancesModule } from './feature-instances/feature-instances.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    EventEmitterModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      resolvers: {
        JSON: GraphQLJSON,
      },
    }),
    AuthzModule,
    FeaturesModule,
    PackagesModule,
    FeatureInstancesModule,
  ],
  providers: [PrismaService],
  controllers: [AppController],
})
export class AppModule {}
