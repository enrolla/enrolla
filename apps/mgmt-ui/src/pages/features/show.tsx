import { useShow } from '@pankod/refine-core';
import { Show, Title, Text } from '@pankod/refine-mantine';
import {
  FeatureViewComponent,
  FEATURE_TYPE_NAMES,
} from '../../components/features/FeatureViewComponent';

import { IFeature } from '../../interfaces';

export const FeatureShow: React.FC = () => {
  const { queryResult } = useShow<IFeature>({
    metaData: {
      fields: ['key', 'type', 'defaultValue', 'description', 'createdAt'],
    },
  });
  const { data, isLoading } = queryResult;
  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Title order={5}>Key</Title>
      <Text mt="xs">{record?.key}</Text>

      <Title mt="xs" order={5}>
        Description
      </Title>
      <Text mt="xs">{record?.description}</Text>

      <Title mt="xs" order={5}>
        Type
      </Title>
      <Text mt="xs">{record && FEATURE_TYPE_NAMES[record?.type]}</Text>

      <Title mt="xs" order={5}>
        Default Value
      </Title>
      {record && (
        <FeatureViewComponent
          value={record.defaultValue.value}
          type={record.type}
        />
      )}
    </Show>
  );
};
