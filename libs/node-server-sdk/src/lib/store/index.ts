import { fetchAllCustomerData } from '../api';
import { Feature } from '../interfaces';
import { decrypt } from '../encryption';
import { _configuration } from '../configuration';
import { SecretDecryptError } from '../errors';

const _customerFeatureStore: Record<string, Record<string, Feature>> = {};
const _customerSecretStore: Record<string, Record<string, string>> = {};

export const refreshStore = async () => {
  const { customers } = await fetchAllCustomerData();

  customers.forEach((customer) => {
    updateCustomerFeatures(customer);


  });
};

export const updateCustomerSecrets = (customer) => {
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

export const updateCustomerFeatures = (customer) => {
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
}

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
