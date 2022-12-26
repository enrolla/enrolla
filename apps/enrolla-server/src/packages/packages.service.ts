import { Injectable } from '@nestjs/common';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { PrismaService } from '../prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Events } from '../constants';
import { Prisma } from '@prisma/client';
import { PackageRemovedEvent } from './events/package-removed.event';
import { PackageUpdatedEvent } from './events/package-updated.event';
import { PackageCreatedEvent } from './events/package-created.event';

@Injectable()
export class PackagesService {
  constructor(
    private prismaService: PrismaService,
    private eventEmitter: EventEmitter2
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
      include: {
        featuresInstances: {
          select: {
            id: true,
          },
        },
      },
    });

    this.eventEmitter.emit(
      Events.PACKAGE_CREATED,
      new PackageCreatedEvent(
        packagez.id,
        packagez.tenantId,
        packagez.name,
        packagez.version,
        packagez.featuresInstances.map((instance) => instance.id),
        packagez.createdAt,
        packagez.parentPackageId,
        packagez.description
      )
    );

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

    this.eventEmitter.emit(
      Events.PACKAGE_UPDATED,
      new PackageUpdatedEvent(packagez.id, packagez.tenantId)
    );

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

    this.eventEmitter.emit(
      Events.PACKAGE_REMOVED,
      new PackageRemovedEvent(packagez.id, packagez.tenantId)
    );

    return packagez;
  }
}
