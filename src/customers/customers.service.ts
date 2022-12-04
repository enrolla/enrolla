import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { SchemasService } from 'src/schemas/schemas.service';
import Ajv from 'ajv';

@Injectable()
export class CustomersService {
  constructor(
    private prismaService: PrismaService,
    private schemasService: SchemasService,
  ) {}

  async createConfigutation(tenantId: string, configuration: JSON) {
    const tenantSchemaDoc = await this.schemasService.findOneByTenant(tenantId);
    const validConfiguration = new Ajv().compile(
      JSON.parse(tenantSchemaDoc.schema),
    );

    if (validConfiguration) {
      return this.prismaService.configuration.create({
        data: {
          tenantId: tenantId,
          configuration: JSON.parse(configuration),
        },
      });
    } else {
      return null;
    }
  }
}
