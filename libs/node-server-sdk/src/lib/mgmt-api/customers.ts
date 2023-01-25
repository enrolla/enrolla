import { Customer, Secret } from '@enrolla/graphql-codegen';
import * as api from '../api';
import { _configuration } from '../configuration';
import { encrypt } from '../encryption';
import { PrivateKeyNotSuppliedError } from '../errors';
import { FeatureValue } from '../interfaces';
import { setCustomerFeatures, setCustomerSecrets } from '../store';

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

  const { updateCustomerByOrgId } = await api.updateCustomerByOrgId({
    organizationId,
    secrets: secretInput.map(({ key, value }) => ({
      key,
      ...encrypt(value, _configuration.privateKey),
    })),
  });

  setCustomerSecrets(updateCustomerByOrgId as Partial<Customer>);

  return updateCustomerByOrgId;
};

export const updateCustomerFeatures = async (
  organizationId: string,
  ...featureInput: { key: string; value: FeatureValue }[]
) => {
  const { updateCustomerByOrgId } = await api.updateCustomerByOrgId({
    organizationId,
    featuresByKey: featureInput.map(({ key, value }) => ({
      key,
      value: { value },
    })),
  });

  setCustomerFeatures(updateCustomerByOrgId as Partial<Customer>);

  return updateCustomerByOrgId;
};
