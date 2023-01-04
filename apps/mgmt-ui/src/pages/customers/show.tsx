import { useShow } from '@pankod/refine-core';
import {
  Show,
  Title,
  Text,
  Table,
  Group,
  ThemeIcon,
} from '@pankod/refine-mantine';
import { IconAsterisk } from '@tabler/icons';
import { FeatureViewComponent } from '../../components/features/FeatureViewComponent';

import { ICustomer, IFeature, IPackage } from '../../interfaces';
import { FeatureValue } from '../../interfaces/features.interface';

type ICustomerShowQueryResult = {
  features: {
    feature: IFeature;
    value: { value: FeatureValue };
  }[];
  effectiveConfiguration: {
    feature: IFeature;
    value: { value: FeatureValue };
  }[];
  package?: IPackage;
} & ICustomer;

export const CustomerShow: React.FC = () => {
  const { queryResult } = useShow<ICustomerShowQueryResult>({
    metaData: {
      fields: [
        'name',
        'organizationId',
        {
          features: [{ feature: ['key', 'type'] }, 'value'],
          effectiveConfiguration: [{ feature: ['key', 'type'] }, 'value'],
          package: ['name'],
        },
      ],
    },
  });
  const { data, isLoading } = queryResult;
  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Title order={5}>Name</Title>
      <Text mt="xs">{record?.name}</Text>

      <Title mt="xs" order={5}>
        Internal Organization ID
      </Title>
      <Text mt="xs">{record?.organizationId}</Text>

      <Title mt="xs" order={5}>
        Uses
      </Title>
      <Text mt="xs">{record?.package?.name ?? 'Default feature values'}</Text>

      <Title mt="xs" order={5}>
        Configuration
      </Title>
      <Text>
        Marked features are customized specifically for this customer (different
        from package / feature defaults).
      </Text>
      <Table mt="xs">
        <thead>
          <tr>
            <th>Key</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {record?.effectiveConfiguration?.map((f) => (
            <tr key={f.feature.key}>
              <td>
                <Group>
                  <Text>{f.feature.key}</Text>
                  {record?.features.find(
                    (cf) => cf.feature.key === f.feature.key
                  ) && (
                    <ThemeIcon radius="md" variant="light">
                      <IconAsterisk size={16} />
                    </ThemeIcon>
                  )}
                </Group>
              </td>
              <td>
                <Group>
                  <FeatureViewComponent
                    type={f.feature.type}
                    value={f.value.value}
                    inline
                  />
                </Group>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Show>
  );
};
