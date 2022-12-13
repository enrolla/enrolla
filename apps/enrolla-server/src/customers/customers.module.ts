import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { SchemasService } from '../schemas/schemas.service';
import { CustomersApiController } from './customers-api.controller';
import { CustomersManagementController } from './customers-management.controller';
import { CustomersService } from './customers.service';

@Module({
  controllers: [CustomersManagementController, CustomersApiController],
  providers: [PrismaService, CustomersService, SchemasService],
})
export class CustomersModule {}
