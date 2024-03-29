import { Injectable } from '@nestjs/common';
import { UpdateFeatureInput } from './dto/update-feature.input';
import { CreateFeatureInput } from './dto/create-feature.input';
import { PrismaService } from '../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FeatureCreatedEvent } from './events/feature-created.event';
import { FeatureUpdatedEvent } from './events/feature-updated.event';
import { FeatureRemovedEvent } from './events/feature-removed.event';
import { Events } from '../constants';
import { FeatureType, Prisma } from '@prisma/client';

@Injectable()
export class FeaturesService {
  constructor(
    private prismaService: PrismaService,
    private eventEmitter: EventEmitter2
  ) {}

  async create(createFeatureDto: CreateFeatureInput, tenantId: string) {
    const feature = await this.prismaService.feature.create({
      data: {
        key: createFeatureDto.key,
        type: createFeatureDto.type,
        description: createFeatureDto.description,
        defaultValue: createFeatureDto.defaultValue as Prisma.JsonObject,
        tenantId: tenantId,
      },
    });

    this.eventEmitter.emit(
      Events.FEATURE_CREATED,
      new FeatureCreatedEvent(
        feature.id,
        tenantId,
        feature.key,
        feature.type,
        feature.defaultValue,
        feature.createdAt,
        feature.description
      )
    );

    return feature;
  }

  async createMany(createFeatureDtos: CreateFeatureInput[], tenantId: string) {
    const features = await this.prismaService.feature.createMany({
      data: createFeatureDtos.map((feature) => ({
        key: feature.key,
        type: feature.type,
        description: feature.description,
        defaultValue: feature.defaultValue
          ? (feature.defaultValue as Prisma.JsonObject)
          : defaultValueByType(feature.type),
        tenantId: tenantId,
      })),
      skipDuplicates: true,
    });

    return features;
  }

  async findAll(tenantId: string) {
    return await this.prismaService.feature.findMany({
      where: {
        tenantId,
      },
    });
  }

  async findOne(id: string, tenantId: string) {
    return await this.prismaService.feature.findUnique({
      where: {
        id_tenantId: {
          id,
          tenantId,
        },
      },
    });
  }

  async findMany(ids: string[], tenantId: string) {
    return await this.prismaService.feature.findMany({
      where: {
        id: {
          in: ids,
        },
        tenantId,
      },
    });
  }

  async update(
    id: string,
    updateFeatureDto: UpdateFeatureInput,
    tenantId: string
  ) {
    const feature = await this.prismaService.feature.update({
      where: {
        id_tenantId: {
          id,
          tenantId,
        },
      },
      data: {},
    });

    this.eventEmitter.emit(
      Events.FEATURE_UPDATED,
      new FeatureUpdatedEvent(feature.id, tenantId)
    );

    return feature;
  }

  async remove(id: string, tenantId: string) {
    const feature = await this.prismaService.feature.delete({
      where: {
        id_tenantId: {
          id,
          tenantId,
        },
      },
    });

    this.eventEmitter.emit(
      Events.FEATURE_REMOVED,
      new FeatureRemovedEvent(feature.id, tenantId)
    );

    return feature;
  }
}

function defaultValueByType(type: FeatureType): object {
  let value: unknown;

  switch (type) {
    case FeatureType.BOOLEAN:
      value = false;
      break;
    case FeatureType.INTEGER:
      value = 0;
      break;
    case FeatureType.STRING:
      value = '';
      break;
    case FeatureType.ARRAY:
      value = [];
      break;
    case FeatureType.JSON:
    default:
      value = {};
  }

  return {
    value: value,
  };
}
