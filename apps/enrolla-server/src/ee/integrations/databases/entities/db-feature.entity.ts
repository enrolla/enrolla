import { FeatureType } from '@prisma/client';
import { DBFeatureMetadata } from './db-feature-metadata.entity';

export class DBFeature extends DBFeatureMetadata {
  value: unknown;

  constructor(name: string, type: FeatureType, value: unknown) {
    super(name, type);

    this.value = value;
  }
}
