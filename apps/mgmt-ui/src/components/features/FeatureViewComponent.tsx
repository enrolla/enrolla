import { Text } from '@pankod/refine-mantine';
import { Prism } from '@mantine/prism';
import { FeatureType, Feature } from '@enrolla/graphql-codegen';

export const FEATURE_TYPE_NAMES: { [key in FeatureType]: string } = {
  INTEGER: 'Integer',
  FLOAT: 'Float',
  STRING: 'String',
  BOOLEAN: 'Boolean',
  JSON: 'JSON',
};

interface FeatureShowProps {
  type: FeatureType;
  value: Feature['defaultValue'];
  inline?: boolean;
}

export const FeatureViewComponent = ({
  value,
  type,
  inline = false,
}: FeatureShowProps) =>
  type === FeatureType.Json ? (
    <Prism language="json" noCopy>
      {JSON.stringify(value as object, null, inline ? 0 : 2)}
    </Prism>
  ) : (
    <Text>{JSON.stringify(value)}</Text>
  );
