import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { SchemasService } from 'src/schemas/schemas.service';
import Ajv from 'ajv';
import { Prisma } from '@prisma/client';

@Injectable()
export class CustomersService {
  constructor(
    private prismaService: PrismaService,
    private schemasService: SchemasService,
  ) {}

  async create(tenantId: string, configuration: Record<string, unknown>) {
    const tenantSchema = await this.schemasService.findOneByTenant(tenantId);
    const compiledSchema = new Ajv().compile(JSON.parse(tenantSchema.schema));
    const validConfiguration = compiledSchema(configuration);

    if (validConfiguration) {
      return this.prismaService.customer.create({
        data: {
          configuration: configuration as Prisma.JsonObject,
          tenantId: tenantId,
          schemaTag: 'v1.0.0',
        },
      });
    } else {
      return null;
    }
  }

  async findAll(tenantId: string) {
    return await this.prismaService.customer.findMany({
      where: { tenantId: tenantId },
    });
  }

  async findById(tenantId: string, customerId: string) {
    // TODO: enforce tenantId
    return await this.prismaService.customer.findUnique({
      where: { id: customerId },
    });
  }

  async deleteById(tenantId: string, customerId: string) {
    return await this.prismaService.customer.delete({
      where: { id: customerId },
    });
  }
}
