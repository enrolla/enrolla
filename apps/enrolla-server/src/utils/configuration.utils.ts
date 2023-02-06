import { FeatureValue } from '../feature-instances/entities/feature-value.entity';

export function getConfigurationFromFeatures(featureInstances): FeatureValue[] {
  return featureInstances.map((featureInstance) => ({
    featureId: featureInstance.featureId,
    value: featureInstance.value,
  }));
}

export function mergeConfigurations(
  mostSignificant: FeatureValue[],
  leastSignificant: FeatureValue[]
): FeatureValue[] {
  return leastSignificant.reduce(
    (acc, lsFeature) => {
      if (
        mostSignificant.findIndex(
          (msFeature) => msFeature.featureId === lsFeature.featureId
        ) === -1
      ) {
        acc.push(lsFeature);
      }
      return acc;
    },
    [...mostSignificant]
  );
}
