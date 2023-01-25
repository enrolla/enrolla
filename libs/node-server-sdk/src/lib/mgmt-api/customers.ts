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
  if (!_configuration?.privateKey) {
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

  console.log(featureInput);
  return await api.updateCustomerByOrgId({
    organizationId,
    featuresByKey: featureInput.map(({ key, value }) => {
      
      if (value instanceof Object) { //todo: check if this is the best way to check if it's an object
        value = JSON.stringify(value);
      }

      return {
        key,
        value: { value },
      };
    }),
  });
};
