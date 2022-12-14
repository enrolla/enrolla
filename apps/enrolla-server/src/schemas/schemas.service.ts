import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SchemasService {
  constructor(private prismaService: PrismaService) {}

  async upsert(
    tenantId: string,
    name: string,
    configuration: Record<string, unknown>
  ) {
    return await this.prismaService.schema.upsert({
      where: { tenantId_name: { tenantId, name } },
      create: {
        tenantId,
        name,
        schema: configuration as Prisma.JsonObject,
      },
      update: {
        tenantId,
        name,
        schema: configuration as Prisma.JsonObject,
      },
    });
  }

  async findAll(tenantId: string) {
    return await this.prismaService.schema.findMany({
      where: { tenantId: tenantId },
    });
  }

  async findOne(tenantId: string, id: string) {
    // TODO: enforce tenantId
    return await this.prismaService.schema.findUnique({
      where: { id: id },
    });
  }

  async findOneByTenant(tenantId: string) {
    return await this.prismaService.schema.findFirst({
      where: { tenantId: tenantId },
    });
  }

  async deleteById(tenantId: string, id: string) {
    // TODO: enforce tenantId
    return await this.prismaService.schema.delete({
      where: { id: id },
    });
  }
}
