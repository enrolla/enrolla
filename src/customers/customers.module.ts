import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { SchemasService } from 'src/schemas/schemas.service';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';

@Module({
  controllers: [CustomersController],
  providers: [PrismaService, CustomersService, SchemasService],
})
export class CustomersModule {}
