import { FeatureType } from '../../graphql-codegen';

export const DEFAULT_VALUES = {
    [FeatureType.String]: '',
    [FeatureType.Integer]: 0,
    [FeatureType.Float]: 0,
    [FeatureType.Boolean]: false,
    [FeatureType.Json]: {},
};
