import { Injectable } from '@nestjs/common';
import { CreateCustomerInput } from './dto/create-customer.input';
import { UpdateCustomerInput } from './dto/update-customer.input';
import { OrganizationsService } from '../organizations/organizations.service';
import { Organization } from '../organizations/entities/organization.entity';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CustomersService {
  constructor(
    private prismaService: PrismaService,
    private organizationsService: OrganizationsService
  ) {}

  async create(createCustomerInput: CreateCustomerInput, tenantId: string) {
    let organization: Organization;

    if (!createCustomerInput.organizationId) {
      organization = await this.organizationsService.create(
        { name: createCustomerInput.name },
        tenantId
      );
    }

    return this.prismaService.customer.create({
      data: {
        name: createCustomerInput.name,
        organizationId: organization?.id,
        tenantId,
        packageId: createCustomerInput.packageId,
        features: {
          create: createCustomerInput.features.map((feature) => ({
            featureId: feature.featureId,
            value: feature.value,
            tenantId,
          })),
        },
      },
    });
  }

  async findAll(tenantId: string) {
    return await this.prismaService.customer.findMany({
      where: {
        tenantId,
      },
    });
  }

  async findOne(id: string, tenantId: string) {
    return await this.prismaService.customer.findUnique({
      where: {
        id_tenantId: {
          id,
          tenantId,
        },
      },
    });
  }

  async update(
    id: string,
    updateCustomerInput: UpdateCustomerInput,
    tenantId: string
  ) {
    return await this.prismaService.customer.update({
      where: {
        id_tenantId: {
          id,
          tenantId,
        },
      },
      data: {},
    });
  }

  async remove(id: string, tenantId: string) {
    return await this.prismaService.customer.delete({
      where: {
        id_tenantId: {
          id,
          tenantId,
        },
      },
    });
  }
}
