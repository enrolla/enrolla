import { FeatureType } from '@enrolla/graphql-codegen';
import { organizationExists, getCustomerFeatureValue } from '../store';
import { Feature, FeatureValue } from '../interfaces';
import { Options } from './types';
import {
  FeatureNotFoundError,
  FeatureNotProvidedError,
  FeatureTypeMismatchError,
  OrganizationNotFoundError,
  OrganizationIdNotProvidedError,
} from '../errors';

export const resolver = (
  feature: string,
  organizationId: string,
  options?: Options
): Feature => {
  if (!feature) {
    throw new FeatureNotProvidedError();
  }

  if (!organizationId) {
    throw new OrganizationIdNotProvidedError();
  }

  if (!organizationExists(organizationId)) {
    throw new OrganizationNotFoundError(feature, organizationId);
  }

  const customerFeature = getCustomerFeatureValue(feature, organizationId);
  if (!customerFeature) {
    throw new FeatureNotFoundError(feature);
  }

  return customerFeature;
};

export const typedResolver = (
  feature: string,
  organizationId: string,
  expectedType: FeatureType,
  options?: Options
): FeatureValue => {
  const result = resolver(feature, organizationId, options);
  if (result.type !== expectedType) {
    throw new FeatureTypeMismatchError(feature, expectedType, result.type);
  }

  return result.value;
};
