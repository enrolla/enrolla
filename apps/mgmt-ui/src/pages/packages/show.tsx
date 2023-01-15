import { useShow } from '@pankod/refine-core';
import { Show, Title, Text, Table } from '@pankod/refine-mantine';
import { FeatureViewComponent } from '../../components/features/FeatureViewComponent';

import { IPackage } from '../../interfaces';

export const PackageShow: React.FC = () => {
  const { queryResult } = useShow<IPackage>({
    metaData: {
      fields: [
        'name',
        'description',
        {
          effectiveConfiguration: [{ feature: ['key', 'type'] }, 'value'],
          parentPackage: ['name'],
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
        Description
      </Title>
      <Text mt="xs">{record?.description}</Text>

      {record?.parentPackage && (
        <>
          <Title mt="xs" order={5}>
            Extends:
          </Title>
          <Text mt="xs">{record?.parentPackage?.name}</Text>
        </>
      )}

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
                <Text>{f.feature.key}</Text>
              </td>
              <td>
                <FeatureViewComponent
                  type={f.feature.type}
                  value={f.value.value}
                  inline
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Show>
  );
};
