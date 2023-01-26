import { FeatureType } from '@prisma/client';

export function featureTypeOfValue(value: unknown): FeatureType {
  switch (typeof value) {
    case 'string':
      return FeatureType.STRING;
    case 'number':
      return FeatureType.INTEGER;
    case 'boolean':
      return FeatureType.BOOLEAN;
    case 'object':
      if (Array.isArray(value)) {
        return FeatureType.ARRAY;
      }
      return FeatureType.JSON;
    default:
      return FeatureType.JSON;
  }
}
