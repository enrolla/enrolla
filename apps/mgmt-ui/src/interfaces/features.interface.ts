export enum FeatureType {
  Integer = 'INTEGER',
  Float = 'FLOAT',
  String = 'STRING',
  Boolean = 'BOOLEAN',
  Json = 'JSON',
}

export type FeatureValue = string | number | boolean | JSON;

export type CustomizedFeature = {
  featureId: string;
  value: FeatureValue;
};
