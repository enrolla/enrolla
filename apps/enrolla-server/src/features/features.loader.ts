import { Injectable } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import { NestDataLoader } from '../dataloader.interceptor';

import { Feature } from './entities/feature.entity';
import { FeaturesService } from './features.service';

@Injectable()
export class FeaturesLoader implements NestDataLoader<string, Feature> {
  constructor(private readonly featuresService: FeaturesService) {}

  generateDataLoader(tenantId: string): DataLoader<string, Feature> {
    return new DataLoader<string, Feature>(async (ids: string[]) => {
      const features = await this.featuresService.findMany(ids, tenantId);
      return ids.map((id) =>
        features.find((feature) => feature.id === id)
      ) as Feature[];
    });
  }
}
