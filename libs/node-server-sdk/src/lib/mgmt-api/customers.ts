import { Customer, Secret } from '@enrolla/graphql-codegen';
import * as api from '../api';
import { _configuration } from '../configuration';
import { encrypt } from '../encryption';
import { PrivateKeyNotSuppliedError } from '../errors';
import { FeatureValue } from '../interfaces';
import { setCustomerFeatures, setCustomerSecrets } from '../store';

/**
 * Creates a customer in Enrolla.
 *
 * @param input - The input to create a customer
 * @param input.name - The name of the customer
 * @param input.organizationId - The organization ID of the customer. This identifier must be unique per customer
 * @param input.createOrganizationName - The name of the organization to create. If this is supplied, the organizationId will be ignored
 * @returns The newly created customer
 */
export const createCustomer = async (input: {
  name: string;
  organizationId?: string;
  createOrganizationName?: string;
}) => {
  const { createCustomer } = await api.createCustomer(input);

  return createCustomer as Customer;
};

/**
 * Updates the customer's secret values with those provided.
 * Secret keys must be created before they can be used.
 *
 * @param organizationId - The organization ID of the customer
 * @param secretInput - The secrets to update
 * @param secretInput.key - The key of the secret (secret keys must be created before their values can be updated)
 * @param secretInput.value - The value of the secret
 * @returns The newly updated customer
 */
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

  return updateCustomerByOrgId as Customer;
};

/**
 * Updates the customer's feature values with those provided.
 * Note that feature types must match those defined in Enrolla.
 *
 * @param organizationId - The organization ID of the customer
 * @param featureInput - The features to update
 * @param featureInput.key - The key (name) of the feature
 * @param featureInput.value - The value of the feature (must match the feature type)
 * @returns The newly updated customer
 */
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

  return updateCustomerByOrgId as Customer;
};
