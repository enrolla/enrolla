import {
  FeatureType,
  FeatureValue,
  CustomizedFeature,
} from './features.interface';

export interface IFeature {
  id: string;
  key: string;
  type: FeatureType;
  defaultValue: { value: FeatureValue };
  description?: string;
  createdAt: string;
}

export interface IPackage {
  id: string;
  name: string;
  description: string?;
  version: string;
  createdAt: string;
  parentPackageId: string;
  features: CustomizedFeature[];
}

export interface ICustomer {
  id: string;
  organizationId?: string;
  name: string;
  package: IPackage;
  createdAt: string;
}
