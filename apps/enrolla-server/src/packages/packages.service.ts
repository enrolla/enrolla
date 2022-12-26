import { Injectable } from '@nestjs/common';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { PrismaService } from '../prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Events } from '../constants';
import { Prisma } from '@prisma/client';
import { FeaturesService } from '../features/features.service';

@Injectable()
export class PackagesService {
  constructor(
    private prismaService: PrismaService,
    private eventEmitter: EventEmitter2,
    private featuresService: FeaturesService
  ) {}

  async create(createPackageDto: CreatePackageDto, tenantId: string) {
    const packagez = await this.prismaService.package.create({
      data: {
        name: createPackageDto.name,
        description: createPackageDto.description,
        tenantId: tenantId,
        parentPackageId: createPackageDto.parentPackageId,
        featuresInstances: {
          create: createPackageDto.features.map((feature) => {
            return {
              featureId: feature.featureId,
              value: { value: feature.value } as Prisma.JsonObject,
              tenantId: tenantId,
            };
          }),
        },
      },
    });

    this.eventEmitter.emit(Events.PACKAGE_CREATED, packagez);

    return packagez;
  }

  async findAll(tenantId: string) {
    return await this.prismaService.package.findMany({
      where: {
        tenantId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        featuresInstances: {
          select: {
            feature: {
              select: {
                key: true,
              },
            },
            value: true,
          },
        },
        parentPackage: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async findOne(id: string, tenantId: string) {
    return await this.prismaService.package.findUnique({
      where: {
        id_tenantId: {
          id,
          tenantId,
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        featuresInstances: {
          select: {
            feature: {
              select: {
                key: true,
              },
            },
            value: true,
          },
        },
        parentPackage: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async update(
    id: string,
    updatePackageDto: UpdatePackageDto,
    tenantId: string
  ) {
    const packagez = await this.prismaService.package.update({
      where: {
        id_tenantId: {
          id,
          tenantId,
        },
      },
      data: {},
    });

    this.eventEmitter.emit(Events.PACKAGE_UPDATED, packagez);

    return packagez;
  }

  async remove(id: string, tenantId: string) {
    const packagez = await this.prismaService.package.delete({
      where: {
        id_tenantId: {
          id,
          tenantId,
        },
      },
    });

    this.eventEmitter.emit(Events.PACKAGE_REMOVED, packagez);

    return packagez;
  }
}
