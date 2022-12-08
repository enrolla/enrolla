import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { SchemasModule } from './schemas/schemas.module';
import { CustomersModule } from './customers/customers.module';
import { AuthzModule } from './authz/authz.module';
import { GithubModule } from './github/github.module';
import { GithubMiddleware } from './github/github.middleware';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SchemasModule,
    CustomersModule,
    AuthzModule,
    GithubModule,
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(GithubMiddleware).forRoutes('/');
  }
}
