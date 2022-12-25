export enum FeatureType {
  Integer = 'INTEGER',
  Float = 'FLOAT',
  String = 'STRING',
  Boolean = 'BOOLEAN',
  Json = 'JSON',
}

export interface IFeature {
  key: string;
  type: FeatureType;
  defaultValue: { value: string | number | boolean | JSON };
  description: string;
  createdAt: string;
}
