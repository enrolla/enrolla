import { Feature, FeatureType } from '@enrolla/graphql-codegen';

class ValidationError extends Error {
  constructor(input: any, feature: Pick<Feature, 'key' | 'type'>) {
    super(
      `Type validation error. Feature "${feature.key}" expected type ${
        feature.type
      } but received type ${typeof input}.`
    );
  }
}

const validatorBuilder =
  (expected: string) =>
  (input: any, feature: Pick<Feature, 'key' | 'type'>) => {
    if (typeof input !== expected) {
      throw new ValidationError(input, feature);
    }

    return true;
  };

const validatorMap = {
  [FeatureType.Boolean]: validatorBuilder('boolean'),
  [FeatureType.Integer]: validatorBuilder('number'),
  [FeatureType.Float]: validatorBuilder('number'),
  [FeatureType.String]: validatorBuilder('string'),
  [FeatureType.Json]: validatorBuilder('object'),
};

export const validateFeatureInputType = (
  input: any,
  feature: Pick<Feature, 'key' | 'type'>
) => {
  const valid = validatorMap[feature.type](input, feature);
  if (!valid) {
    throw new Error(
      `Type validation error. Unknown feature type ${feature.type} for feature ${feature.key}.`
    );
  }
};
