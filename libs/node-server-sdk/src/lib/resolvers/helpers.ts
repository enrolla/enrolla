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
import { _configuration } from '../configuration';

export const baseResolver = (
  feature: string,
  organizationId: string,
  options?: Options // eslint-disable-line @typescript-eslint/no-unused-vars
): Feature => {
  if (!feature) {
    throw new FeatureNotProvidedError();
  }

  if (!organizationId) {
    throw new OrganizationIdNotProvidedError();
  }

  _configuration?.evaluationHooks?.beforeEvaluation?.(feature, organizationId);

  if (!organizationExists(organizationId)) {
    throw new OrganizationNotFoundError(feature, organizationId);
  }

  const customerFeature = getCustomerFeatureValue(feature, organizationId);
  if (!customerFeature) {
    throw new FeatureNotFoundError(feature);
  }

  return customerFeature;
};

export const resolver = (
  feature: string,
  organizationId: string,
  options?: Options
): FeatureValue => {
  const result = baseResolver(feature, organizationId, options);
  _configuration?.evaluationHooks?.afterEvaluation?.(
    feature,
    organizationId,
    result.value
  );

  return result.value;
};

export const typedResolver = (
  feature: string,
  organizationId: string,
  expectedType: FeatureType,
  options?: Options
): FeatureValue => {
  const result = baseResolver(feature, organizationId, options);
  if (result.type !== expectedType) {
    throw new FeatureTypeMismatchError(feature, expectedType, result.type);
  }
  _configuration?.evaluationHooks?.afterEvaluation?.(
    feature,
    organizationId,
    result.value
  );

  return result.value;
};
