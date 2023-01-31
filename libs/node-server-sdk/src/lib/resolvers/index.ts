import { FeatureType } from '@enrolla/graphql-codegen';
import { Options } from './types';
import { FeatureValue } from '../interfaces';
import { resolver, typedResolver, secretResolver } from './utils';

/**
 * Evaluates the feature value for the given organization and returns the result.
 *
 * @param feature The feature name.
 * @param organizationId The unique identifier of the organization.
 * @param options
 * @returns The evaluated feature value.
 */
export const getFeatureValue = <T extends FeatureType>(
  feature: string,
  organizationId: string,
  options?: Options
): T => resolver(feature, organizationId, options) as T;

/**
 * Evaluates the feature value for the given organization and returns the result.
 * Note that this function can only be used for features of type String.
 *
 * @param feature The feature name.
 * @param organizationId The unique identifier of the organization.
 * @param options
 * @returns The evaluated feature value.
 */
export const getFeatureStringValue = (
  feature: string,
  organizationId: string,
  options?: Options
): string =>
  typedResolver(feature, organizationId, FeatureType.String, options) as string;

/**
 * Evaluates the feature value for the given organization and returns the result.
 * Note that this function can only be used for features of type Integer.
 *
 * @param feature The feature name.
 * @param organizationId The unique identifier of the organization.
 * @param options
 * @returns The evaluated feature value.
 */
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

/**
 * Evaluates the feature value for the given organization and returns the result.
 * Note that this function can only be used for features of type Float.
 *
 * @param feature The feature name.
 * @param organizationId The unique identifier of the organization.
 * @param options
 * @returns The evaluated feature value.
 */
export const getFeatureFloatValue = (
  feature: string,
  organizationId: string,
  options?: Options
): number =>
  typedResolver(feature, organizationId, FeatureType.Float, options) as number;

/**
 * Evaluates the feature value for the given organization and returns the result.
 * Note that this function can only be used for features of type Boolean.
 *
 * @param feature The feature name.
 * @param organizationId The unique identifier of the organization.
 * @param options
 * @returns The evaluated feature value.
 */
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

/**
 * Evaluates the feature value for the given organization and returns the result.
 * Note that this function can only be used for features of type JSON.
 *
 * @param feature The feature name.
 * @param organizationId The unique identifier of the organization.
 * @param options
 * @returns The evaluated feature value.
 */
export const getFeatureJsonValue = (
  feature: string,
  organizationId: string,
  options?: Options
): Record<string, unknown> =>
  typedResolver(feature, organizationId, FeatureType.Json, options) as Record<
    string,
    unknown
  >;

/**
 * Evaluates the secret value for the given organization and returns the result.
 * @param key The secret name.
 * @param organizationId The unique identifier of the organization.
 * @param options
 * @returns The secret value.
 */
export const getSecretValue = (
  key: string,
  organizationId: string,
  options?: Options
): string => secretResolver(key, organizationId, options) as string;
