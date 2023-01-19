import { Customer } from '@enrolla/graphql-codegen';
import { useShow } from '@pankod/refine-core';
import {
  Show,
  Title,
  Text,
  Table,
  Group,
  ThemeIcon,
  Tooltip,
  Space,
} from '@pankod/refine-mantine';
import { IconAsterisk } from '@tabler/icons';
import { FeatureViewComponent } from '../../components/features/FeatureViewComponent';

export const CustomerShow: React.FC = () => {
  const { queryResult } = useShow<Customer>({
    metaData: {
      fields: [
        'name',
        'organizationId',
        {
          features: [{ feature: ['key', 'type'] }, 'value'],
          secrets: ['key'],
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
                    <Tooltip
                      withArrow
                      label="Customized for this customer (different from package / feature defaults)"
                    >
                      <ThemeIcon radius="md" variant="light">
                        <IconAsterisk size={16} />
                      </ThemeIcon>
                    </Tooltip>
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
      <Space h="md" />
      <Title mt="xs" order={5}>
        Secrets
      </Title>
      <Table mt="xs">
        <thead>
          <tr>
            <th>Key</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {record?.secrets?.map((s) => (
            <tr key={s.key}>
              <td>
                <Group>
                  <Text>{s.key}</Text>
                </Group>
              </td>
              <td>
                <Text>*****</Text>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Show>
  );
};
