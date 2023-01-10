import { FeatureValue } from '../interfaces/feature.class';

type BaseOptions = {
  organizationId?: string;
};

type AnyDefault = {
  defaultValue?: FeatureValue;
};

type StringDefault = {
  defaultValue?: string;
};

type NumberDefault = {
  defaultValue?: number;
};

type FloatDefault = {
  defaultValue?: number;
};

type BooleanDefault = {
  defaultValue?: boolean;
};

type JsonDefault = {
  defaultValue?: Record<string, unknown>;
};

export type Options = BaseOptions & AnyDefault;

export type StringValueOptions = BaseOptions & StringDefault;

export type NumberValueOptions = BaseOptions & NumberDefault;

export type FloatValueOptions = BaseOptions & FloatDefault;

export type BooleanValueOptions = BaseOptions & BooleanDefault;

export type JsonValueOptions = BaseOptions & JsonDefault;
