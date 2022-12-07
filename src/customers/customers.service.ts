import { BadRequestException, Injectable } from '@nestjs/common';
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
    const compiledSchema = new Ajv().compile(
      tenantSchema.schema as Prisma.JsonObject,
    );
    const validConfiguration = compiledSchema(configuration);

    if (!validConfiguration) {
      // TODO: replace with dedicated exception and return BadRequest in controller level
      throw new BadRequestException(
        compiledSchema.errors.map((e) => {
          return { path: e.instancePath, error: e.message };
        }),
      );
    }

    return this.prismaService.customer.create({
      data: {
        configuration: configuration as Prisma.JsonObject,
        tenantId: tenantId,
        schemaId: tenantSchema.id,
        schemaTag: 'v1.0.0',
      },
    });
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
