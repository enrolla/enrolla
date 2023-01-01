import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class FeatureInstancesService {
  constructor(private prismaService: PrismaService) {}

  async findAll(tenantId: string) {
    return await this.prismaService.packageFeature.findMany({
      where: {
        tenantId,
      },
    });
  }

  async findOne(id: string, tenantId: string) {
    return await this.prismaService.packageFeature.findUnique({
      where: {
        id_tenantId: {
          id,
          tenantId,
        },
      },
    });
  }

  async findByPackageId(packageId: string, tenantId: string) {
    return await this.prismaService.packageFeature.findMany({
      where: {
        packageId,
        tenantId,
      },
    });
  }
}
