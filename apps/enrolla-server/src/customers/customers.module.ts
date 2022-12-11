import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { SchemasService } from '../schemas/schemas.service';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';

@Module({
  controllers: [CustomersController],
  providers: [PrismaService, CustomersService, SchemasService],
})
export class CustomersModule {}
