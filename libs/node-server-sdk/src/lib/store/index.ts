import { fetchAllCustomerFeatures } from '../api';
import { Feature } from '../interfaces';

const _customerFeatureStore: Record<string, Record<string, Feature>> = {};

export const refreshStore = async () => {
  const { customers } = await fetchAllCustomerFeatures();

  let customerConfig: Record<string, Feature>;
  customers.forEach((customer) => {
    if (!_customerFeatureStore[customer.organizationId]) {
      _customerFeatureStore[customer.organizationId] = {};
    }

    customerConfig = _customerFeatureStore[customer.organizationId];
    customer.effectiveConfiguration.forEach((featureValue) => {
      customerConfig[featureValue.feature.key] = new Feature(
        featureValue.feature.type,
        featureValue.value.value
      );
    });
  });
};

export const organizationExists = (organizationId: string): boolean =>
  !!_customerFeatureStore[organizationId];

export const getCustomerFeatureValue = (
  key: string,
  organizationId: string
): Feature | undefined => _customerFeatureStore[organizationId]?.[key];
