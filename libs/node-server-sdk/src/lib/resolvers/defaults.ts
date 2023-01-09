import { FeatureType } from 'libs/graphql-codegen/output';

export const DEFAULT_VALUES = {
    [FeatureType.String]: '',
    [FeatureType.Integer]: 0,
    [FeatureType.Float]: 0,
    [FeatureType.Boolean]: false,
    [FeatureType.Json]: {},
};
