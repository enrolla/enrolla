import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { SchemasModule } from './schemas/schemas.module';
import { CustomersModule } from './customers/customers.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [ConfigModule.forRoot(), SchemasModule, CustomersModule],
  controllers: [AppController],
})
export class AppModule {}
