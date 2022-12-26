import { Injectable } from '@nestjs/common';
import { UpdateFeatureInput } from './dto/update-feature.input';
import { CreateFeatureInput } from './dto/create-feature.input';
import { PrismaService } from '../prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FeatureCreatedEvent } from './events/feature-created.event';
import { FeatureUpdatedEvent } from './events/feature-updated.event';
import { FeatureRemovedEvent } from './events/feature-removed.event';
import { Events } from '../constants';
import { Prisma } from '@prisma/client';

@Injectable()
export class FeaturesService {
  constructor(
    private prismaService: PrismaService,
    private eventEmitter: EventEmitter2
  ) {}

  async create(createFeatureDto: CreateFeatureInput, tenantId: string) {
    console.log('createFeatureDto.defaultValue', createFeatureDto.defaultValue);
    const feature = await this.prismaService.feature.create({
      data: {
        key: createFeatureDto.key,
        type: createFeatureDto.type,
        description: createFeatureDto.description,
        defaultValue: { value: 5 }, // createFeatureDto.defaultValue as Prisma.JsonObject,
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
  }
}
