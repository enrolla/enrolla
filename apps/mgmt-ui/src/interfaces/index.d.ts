import { FeatureType, FeatureValue } from './features.interface';

export interface IFeature {
  key: string;
  type: FeatureType;
  defaultValue: { value: FeatureValue };
  description?: string;
  createdAt: string;
}
