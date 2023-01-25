import { Secret } from '@enrolla/graphql-codegen';
import * as api from '../api';
import { _configuration } from '../configuration';
import { encrypt } from '../encryption';
import { EnrollaError, PrivateKeyNotSuppliedError } from '../errors';
import { FeatureValue } from '../interfaces';

export const createCustomer = async (input: {
  name: string;
  organizationId?: string;
  createOrganizationName?: string;
}) => {
  return await api.createCustomer(input);
};

export const updateCustomerSecrets = async (
  organizationId: string,
  ...secretInput: Pick<Secret, 'key' | 'value'>[]
) => {
  if (!_configuration.privateKey) {
    throw new PrivateKeyNotSuppliedError();
  }

  return await api.updateCustomerByOrgId({
    organizationId,
    secrets: secretInput.map(({ key, value }) => ({
      key,
      ...encrypt(value, _configuration.privateKey),
    })),
  });
};

export const updateCustomerFeatures = async (
  organizationId: string,
  ...featureInput: { key: string; value: FeatureValue }[]
) => {
  const { features } = await api.getAllFeatures();

  return await api.updateCustomerByOrgId({
    organizationId,
    features: featureInput.map(({ key, value }) => {
      const feature = features.find((f) => f.key === key);
      if (!feature) {
        throw new EnrollaError(`Feature with key "${key}" not found.`);
      }

      return {
        featureId: feature.id,
        value: { value },
      };
    }),
  });
};
