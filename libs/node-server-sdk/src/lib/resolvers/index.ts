import { FeatureType } from '../../graphql-codegen';
import { Options, StringValueOptions, NumberValueOptions, FloatValueOptions, BooleanValueOptions, JsonValueOptions } from './types';
import { FeatureValue } from '../interfaces';
import { safeResolver, safeTypedResolver } from './helpers';

export const getFeatureValue = (feature: string, options?: Options): FeatureValue | undefined => safeResolver(feature, options);

export const getFeatureStringValue = (feature: string, options?: StringValueOptions): string => safeTypedResolver(feature, FeatureType.String, options) as string;

export const getFeatureIntegerValue = (feature: string, options?: NumberValueOptions): number => safeTypedResolver(feature, FeatureType.Integer, options) as number;

export const getFeatureFloatValue = (feature: string, options?: FloatValueOptions): number => safeTypedResolver(feature, FeatureType.Float, options) as number;

export const getFeatureBooleanValue = (feature: string, options?: BooleanValueOptions): boolean => safeTypedResolver(feature, FeatureType.Boolean, options) as boolean;

export const getFeatureJsonValue = (feature: string, options?: JsonValueOptions): Record<string, unknown> => safeTypedResolver(feature, FeatureType.Json, options) as Record<string, unknown>;
