import { fetchAllCustomerData } from '../api';
import { Feature } from '../interfaces';
import { decrypt } from '../encryption';
import { _configuration } from '../configuration';

const _customerFeatureStore: Record<string, Record<string, Feature>> = {};
const _customerSecretStore: Record<string, Record<string, string>> = {};


export const refreshStore = async () => {
  const { customers } = await fetchAllCustomerData();

  customers.forEach((customer) => {
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

    if(_configuration.privateKey) {
      if (!_customerSecretStore[customer.organizationId]) {
        _customerSecretStore[customer.organizationId] = {};
      }
  
      const customerSecrets = _customerSecretStore[customer.organizationId];
      customer.secrets.forEach((secret) => {
        customerSecrets[secret.key] = decrypt(_configuration.privateKey, secret);
      });
    }
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
