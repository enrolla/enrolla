import { FeatureType } from '@enrolla/graphql-codegen';
import { Options } from './types';
import { FeatureValue } from '../interfaces';
import { resolver, typedResolver } from './helpers';

export const getFeatureValue = (
  feature: string,
  organizationId: string,
  options?: Options
): FeatureValue => resolver(feature, organizationId, options);

export const getFeatureStringValue = (
  feature: string,
  organizationId: string,
  options?: Options
): string =>
  typedResolver(feature, organizationId, FeatureType.String, options) as string;

export const getFeatureIntegerValue = (
  feature: string,
  organizationId: string,
  options?: Options
): number =>
  typedResolver(
    feature,
    organizationId,
    FeatureType.Integer,
    options
  ) as number;

export const getFeatureFloatValue = (
  feature: string,
  organizationId: string,
  options?: Options
): number =>
  typedResolver(feature, organizationId, FeatureType.Float, options) as number;

export const getFeatureBooleanValue = (
  feature: string,
  organizationId: string,
  options?: Options
): boolean =>
  typedResolver(
    feature,
    organizationId,
    FeatureType.Boolean,
    options
  ) as boolean;

export const getFeatureJsonValue = (
  feature: string,
  organizationId: string,
  options?: Options
): Record<string, unknown> =>
  typedResolver(feature, organizationId, FeatureType.Json, options) as Record<
    string,
    unknown
  >;
