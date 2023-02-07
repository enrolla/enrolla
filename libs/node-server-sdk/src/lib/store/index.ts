import { Feature } from '../interfaces';
import { decrypt } from '../encryption';
import { _configuration } from '../configuration';
import { SecretDecryptError } from '../errors';
import { Customer } from '@enrolla/graphql-codegen';

const _customerFeatureStore: Record<string, Record<string, Feature>> = {};
const _customerSecretStore: Record<string, Record<string, string>> = {};

/**
 * Refreshes the store (in memory cache) with the customer data provided.
 *
 * @param customers - The customer data to refresh the store with.
 */
export const refreshStore = (customers: Customer[] = []) => {
  customers.forEach((customer: Customer) => {
    setCustomerFeatures(customer);
    setCustomerSecrets(customer);
  });
};

export const setCustomerSecrets = (
  customer: Pick<Customer, 'organizationId' | 'secrets'>
) => {
  if (_configuration.privateKey) {
    if (!_customerSecretStore[customer.organizationId]) {
      _customerSecretStore[customer.organizationId] = {};
    }

    const customerSecrets = _customerSecretStore[customer.organizationId];
    customer.secrets.forEach((secret) => {
      try {
        customerSecrets[secret.key] = decrypt(
          _configuration.privateKey,
          secret
        );
      } catch (e) {
        throw new SecretDecryptError(secret.key, e);
      }
    });
  }
};

export const setCustomerFeatures = (
  customer: Pick<Customer, 'organizationId' | 'effectiveConfiguration'>
) => {
  if (!_customerFeatureStore[customer.organizationId]) {
    _customerFeatureStore[customer.organizationId] = {};
  }

  const customerFeatures = _customerFeatureStore[customer.organizationId];
  customer.effectiveConfiguration.forEach((featureValue) => {
    customerFeatures[featureValue.feature.key] = new Feature(
      featureValue.feature.type,
      featureValue.value.value
    );
  });
};

export const organizationExists = (organizationId: string): boolean =>
  !!_customerFeatureStore[organizationId];

export const getCustomerFeatureValue = (
  key: string,
  organizationId: string
): Feature | undefined => _customerFeatureStore[organizationId]?.[key];

export const getCustomerSecretValue = (
  key: string,
  organizationId: string
): string | undefined => _customerSecretStore[organizationId]?.[key];
