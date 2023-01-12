import { Injectable } from '@nestjs/common';
import { CreatePackageInput } from './dto/create-package.input';
import { UpdatePackageInput } from './dto/update-package.input';
import { PrismaService } from '../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Events } from '../constants';
import { PackageRemovedEvent } from './events/package-removed.event';
import { PackageUpdatedEvent } from './events/package-updated.event';
import { PackageCreatedEvent } from './events/package-created.event';
import { FeatureValue } from '../feature-instances/entities/feature-value.entity';
import { FeatureInstancesService } from '../feature-instances/feature-instances.service';
import {
  getConfigurationFromFeatures,
  mergeConfigurations,
} from '../utils/configuration.utils';
import { Prisma } from '@prisma/client';
import { FeaturesService } from '../features/features.service';
import { PackageUpdateStrategy } from './update-strategies/strategies';
import { migrateAllChildren } from './update-strategies/migrate-all-children.strategy';

@Injectable()
export class PackagesService {
  constructor(
    private prismaService: PrismaService,
    private eventEmitter: EventEmitter2,
    private featureInstancesService: FeatureInstancesService,
    private featuresService: FeaturesService
  ) {}

  async create(createPackageDto: CreatePackageInput, tenantId: string) {
    const packagez = await this.prismaService.package.create({
      data: {
        name: createPackageDto.name,
        description: createPackageDto.description,
        icon: createPackageDto.icon,
        tenantId: tenantId,
        parentPackageId: createPackageDto.parentPackageId,
        features: {
          create: createPackageDto.features.map((feature) => {
            return {
              featureId: feature.featureId,
              value: feature.value as Prisma.JsonObject,
              tenantId: tenantId,
            };
          }),
        },
      },
      include: {
        features: {
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
        packagez.features.map((instance) => instance.id),
        packagez.createdAt,
        packagez.parentPackageId,
        packagez.description,
        packagez.icon
      )
    );

    return packagez;
  }

  async findAll(tenantId: string) {
    return await this.prismaService.package.findMany({
      where: {
        tenantId,
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
    });
  }

  async update(
    id: string,
    updatePackageDto: UpdatePackageInput,
    tenantId: string
  ) {
    if (
      (updatePackageDto.features || updatePackageDto.parentPackageId) &&
      !updatePackageDto.updateStrategy
    ) {
      throw new Error(
        'Cannot update features or parent package without update strategy'
      );
    }

    let newPackageId = id;
    switch (updatePackageDto.updateStrategy) {
      case PackageUpdateStrategy.MIGRATE_ALL_CHILDREN:
        newPackageId = await migrateAllChildren(
          this.prismaService,
          id,
          updatePackageDto,
          tenantId
        );
    }

    const packagez = await this.prismaService.package.update({
      where: {
        id_tenantId: {
          id: newPackageId,
          tenantId,
        },
      },
      data: {
        name: updatePackageDto.name,
        description: updatePackageDto.description,
        icon: updatePackageDto.icon,
      },
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

  async getConfiguration(
    packageId: string,
    tenantId: string
  ): Promise<FeatureValue[]> {
    const packageFeatures = await this.featureInstancesService.findByPackageId(
      packageId,
      tenantId
    );

    return getConfigurationFromFeatures(packageFeatures);
  }

  async getEffectiveConfiguration(
    packageId: string,
    tenantId: string
  ): Promise<FeatureValue[]> {
    if (packageId === null) {
      const allFeatures = await this.featuresService.findAll(tenantId);
      const defaultConfig: FeatureValue[] = allFeatures.map(
        (f) =>
          ({
            feature: f,
            featureId: f.id,
            value: f.defaultValue,
          } as FeatureValue)
      );

      return defaultConfig;
    }

    const packagez = await this.findOne(packageId, tenantId);
    const packageConfig = await this.getConfiguration(packagez.id, tenantId);

    const parentPackageConfig = await this.getEffectiveConfiguration(
      packagez.parentPackageId,
      tenantId
    );

    return mergeConfigurations(packageConfig, parentPackageConfig);
  }
}
