import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import SchemasController from './schemas.controller';
import { SchemasService } from './schemas.service';

@Module({
  controllers: [SchemasController],
  providers: [SchemasService, PrismaService],
})
export class SchemasModule {}
