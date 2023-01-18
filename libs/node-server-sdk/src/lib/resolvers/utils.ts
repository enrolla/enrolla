import { FeatureType } from '@enrolla/graphql-codegen';
import { organizationExists, getCustomerFeatureValue, getCustomerSecretValue } from '../store';
import { Feature, FeatureValue } from '../interfaces';
import { Options } from './types';
import {
  FeatureNotFoundError,
  ArgumentNotProvidedError,
  FeatureTypeMismatchError,
  OrganizationNotFoundError,
  OrganizationIdNotProvidedError,
  NotInitializedError,
  SecretNotFoundError,
  PrivateKeyNotSuppliedError,
} from '../errors';
import { _configuration } from '../configuration';

const validate = (
  key: string,
  organizationId: string,
  argumentName: string): void => {

  if (!_configuration?.apiToken) {
    throw new NotInitializedError();
  }

  if (!key) {
    throw new ArgumentNotProvidedError(argumentName);
  }

  if (!organizationId) {
    throw new OrganizationIdNotProvidedError();
  }

  _configuration?.evaluationHooks?.beforeEvaluation?.(key, organizationId);

  if (!organizationExists(organizationId)) {
    throw new OrganizationNotFoundError(key, organizationId);
  }
}

export const baseResolver = (
  feature: string,
  organizationId: string,
  options?: Options // eslint-disable-line @typescript-eslint/no-unused-vars
): Feature => {
  validate(feature, organizationId, 'feature');

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

export const secretResolver = (
  key: string,
  organizationId: string,
  options?: Options // eslint-disable-line @typescript-eslint/no-unused-vars
): string => {
  if (!_configuration?.privateKey) {
    throw new PrivateKeyNotSuppliedError();
  }
  validate(key, organizationId, 'secret');

  const customerSecret = getCustomerSecretValue(key, organizationId);
  if (!customerSecret) {
    throw new SecretNotFoundError(key);
  }

  return customerSecret;
};
