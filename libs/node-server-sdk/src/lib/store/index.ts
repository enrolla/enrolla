import { stripIgnoredCharacters } from "graphql";
import { FeatureDefaultFragment, FeatureValueFragment } from "libs/graphql-codegen/output";
import { fetchAllCustomersAndFeatures } from "../api";
import { Feature } from "../interfaces";

const _defaultFeatureStore: Record<string, Feature> = {};
const _customerFeatureStore: Record<string, Record<string, Feature>> = {};

export const refreshStore = async () => {
  const { customers, features } = await fetchAllCustomersAndFeatures();

  features.forEach((feature) => {
    _defaultFeatureStore[feature.key] = new Feature(feature.type, feature.defaultValue.value);
  });

  let customerConfig: Record<string, Feature>;
  customers.forEach((customer) => {
    if (!_customerFeatureStore[customer.organizationId]) {
        _customerFeatureStore[customer.organizationId] = {};
    };

    customerConfig = _customerFeatureStore[customer.organizationId];
    customer.effectiveConfiguration.forEach((featureValue) => {
        customerConfig[featureValue.feature.key] = new Feature(featureValue.feature.type, featureValue.value.value);
    });
  });
}

export const exists = (key: string): boolean => !!_defaultFeatureStore[key];

export const getDefaultFeatureValue = (key: string): Feature | undefined => _defaultFeatureStore[key];

export const getCustomerFeatureValue = (key: string, organizationId: string): Feature | undefined => _customerFeatureStore[organizationId]?.[key];
