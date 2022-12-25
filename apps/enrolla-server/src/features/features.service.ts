import { Injectable } from '@nestjs/common';
import { UpdateFeatureDto } from './dto/update-feature.dto';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { PrismaService } from '../prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FeatureCreatedEvent } from './events/feature-created.event';
import { FeatureUpdatedEvent } from './events/feature-updated.event';
import { FeatureRemovedEvent } from './events/feature-removed.event';
import { Events } from '../constants';

@Injectable()
export class FeaturesService {
  constructor(
    private prismaService: PrismaService,
    private eventEmitter: EventEmitter2
  ) {}

  async create(createFeatureDto: CreateFeatureDto, tenantId: string) {
    const feature = await this.prismaService.feature.create({
      data: {
        ...createFeatureDto,
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
        feature.createdAt,
        feature.description
      )
    );

    return feature;
  }

  async findAll(tenantId: string) {
    return await this.prismaService.feature.findMany();
  }

  async findOne(id: string, tenantId: string) {
    return await this.prismaService.feature.findUnique({
      where: {
        id,
      },
    });
  }

  async update(
    id: string,
    updateFeatureDto: UpdateFeatureDto,
    tenantId: string
  ) {
    const feature = await this.prismaService.feature.update({
      where: {
        id,
      },
      data: updateFeatureDto,
    });

    this.eventEmitter.emit(
      Events.FEATURE_UPDATED,
      new FeatureUpdatedEvent(feature.id, tenantId)
    );
  }

  async remove(id: string, tenantId: string) {
    const feature = await this.prismaService.feature.delete({
      where: {
        id,
      },
    });

    this.eventEmitter.emit(
      Events.FEATURE_REMOVED,
      new FeatureRemovedEvent(feature.id, tenantId)
    );
  }
}
