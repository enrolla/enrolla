import { FeatureType } from '../../graphql-codegen';
import { exists, getCustomerFeatureValue, getDefaultFeatureValue } from '../store';
import { Feature, FeatureValue } from '../interfaces';
import { DEFAULT_VALUES } from './defaults';
import { Options } from './types';
import { FeatureNotFoundError, FeatureTypeError, CustomerFeatureNotFoundError, OrganizationIdNotSuppliedError } from './errors';

const featureResolverBase = (feature: string, options?: Options): Feature | undefined => {
    const organizationId = options?.organizationId;

    if(!exists(feature)) {
        throw new FeatureNotFoundError();
    }

    if (!organizationId) {
        throw new OrganizationIdNotSuppliedError()
    }

    const customerFeature = getCustomerFeatureValue(feature, organizationId);
    if (!customerFeature) {
        throw new CustomerFeatureNotFoundError();
    }

    return customerFeature;
}

const typedDefaultValue = (feature: string, expectedType: FeatureType | undefined, options?: Options): FeatureValue | undefined => {
    const defaultFeature = getDefaultFeatureValue(feature);

    if (!expectedType) {
        return defaultFeature?.value;
    }
            
    return defaultFeature.type === expectedType ? 
        defaultFeature.value 
        : 
        options?.defaultValue ?? DEFAULT_VALUES[expectedType];
}

const handleErrors = (error: Error, feature: string, expectedType: FeatureType | undefined, options?: Options) => {
    // TODO call 'onError' hook function to log appropriately

    switch (error.constructor) {
        case FeatureNotFoundError:
            return options?.defaultValue ?? DEFAULT_VALUES[expectedType];

        case OrganizationIdNotSuppliedError:
            return typedDefaultValue(feature, expectedType, options);

        case CustomerFeatureNotFoundError:
            return typedDefaultValue(feature, expectedType, options);

        case FeatureTypeError:
            return typedDefaultValue(feature, expectedType, options);
        default:
            return options?.defaultValue ?? DEFAULT_VALUES[expectedType];
    }
}

export const safeTypedResolver = (feature: string, expectedType: FeatureType, options?: Options): FeatureValue => {
    try {
        const result = featureResolverBase(feature, options);
        if (result.type !== expectedType) {
            throw new FeatureTypeError();
        }

        return result.value;
    } catch (error) {
        handleErrors(error, feature, expectedType, options);
    }
}

export const safeResolver = (feature: string, options?: Options): FeatureValue | undefined => {
    try {
        return featureResolverBase(feature, options).value;
    } catch (error) {
        handleErrors(error, feature, undefined, options);
    }
}
