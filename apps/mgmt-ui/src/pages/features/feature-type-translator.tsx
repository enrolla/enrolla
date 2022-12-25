import { FeatureType } from '../../interfaces';

export const FEATURE_TYPE_NAMES: { [key in FeatureType]: string } = {
  INTEGER: 'Integer',
  FLOAT: 'Float',
  STRING: 'String',
  BOOLEAN: 'Boolean',
  JSON: 'JSON',
};
