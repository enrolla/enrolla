import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { SchemasModule } from './schemas/schemas.module';
import { AuthzModule } from './authz/authz.module';
import { PrismaService } from './prisma.service';
import { SchemasService } from './schemas/schemas.service';
import { TenantsModule } from './tenants/tenants.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SchemasModule,
    AuthzModule,
    TenantsModule,
  ],
  providers: [GithubService, PrismaService, SchemasService],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(GithubMiddleware).forRoutes('/');
  }
}
