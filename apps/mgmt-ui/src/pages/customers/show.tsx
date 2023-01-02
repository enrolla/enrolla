import { useShow } from '@pankod/refine-core';
import { Show, Title, Text, Table } from '@pankod/refine-mantine';
import { FeatureViewComponent } from '../../components/features/FeatureViewComponent';

import { ICustomer, IFeature, IPackage } from '../../interfaces';
import { FeatureValue } from '../../interfaces/features.interface';

type ICustomerShowQueryResult = {
  features: {
    feature: IFeature;
    value: FeatureValue;
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

      {record?.package && (
        <>
          <Title mt="xs" order={5}>
            Uses:
          </Title>
          <Text mt="xs">{record?.package?.name}</Text>
        </>
      )}

      <Title mt="xs" order={5}>
        Customized Features
      </Title>
      <Table mt="xs">
        <thead>
          <tr>
            <th>Key</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {record?.features?.map((f) => (
            <tr key={f.feature.key}>
              <td>{f.feature.key}</td>
              <td>
                <FeatureViewComponent
                  type={f.feature.type}
                  value={f.value}
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
