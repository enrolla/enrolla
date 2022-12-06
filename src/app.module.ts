import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { SchemasModule } from './schemas/schemas.module';
import { CustomersModule } from './customers/customers.module';
import { AuthzModule } from './authz/authz.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SchemasModule,
    CustomersModule,
    AuthzModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
