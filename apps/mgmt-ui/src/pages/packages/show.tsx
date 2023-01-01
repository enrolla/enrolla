import { useShow } from '@pankod/refine-core';
import { Show, Title, Text, Table } from '@pankod/refine-mantine';
import { FeatureViewComponent } from '../../components/features/FeatureViewComponent';

import { IFeature, IPackage } from '../../interfaces';
import { FeatureValue } from '../../interfaces/features.interface';

type IPackageShowQueryResult = {
  featuresInstances: {
    feature: IFeature;
    value: FeatureValue;
  }[];
  parentPackage?: IPackage;
} & IPackage;

export const PackageShow: React.FC = () => {
  const { queryResult } = useShow<IPackageShowQueryResult>({
    metaData: {
      fields: [
        'name',
        'description',
        {
          featuresInstances: [{ feature: ['key', 'type'] }, 'value'],
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
          {record?.featuresInstances.map((featureInstance) => (
            <tr key={featureInstance.feature.key}>
              <td>{featureInstance.feature.key}</td>
              <td>
                <FeatureViewComponent
                  type={featureInstance.feature.type}
                  value={featureInstance.value}
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
