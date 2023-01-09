import { FeatureType } from '../../graphql-codegen';

export type FeatureValue = string | number | boolean | Record<string, unknown>

export class Feature {
    readonly type: FeatureType
    readonly value: FeatureValue

    constructor (type: FeatureType, value: FeatureValue) {
        this.type = type;
        this.value = value;
    }
}
