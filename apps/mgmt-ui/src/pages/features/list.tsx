import { useTable, ColumnDef, flexRender } from '@pankod/refine-react-table';
import {
  Box,
  Group,
  List,
  ScrollArea,
  Table,
  Pagination,
  ShowButton,
  DeleteButton,
  DateField,
  Text,
  Space,
} from '@pankod/refine-mantine';
import { Feature, FeatureType } from '@enrolla/graphql-codegen';
import { useMemo } from 'react';
import {
  FeatureViewComponent,
  FEATURE_TYPE_NAMES,
} from '../../components/features/FeatureViewComponent';
import { useNavigation } from '@pankod/refine-core';

export const FeatureList: React.FC = () => {
  const columns = useMemo<ColumnDef<Feature>[]>(
    () => [
      {
        id: 'key',
        header: 'Key',
        accessorKey: 'key',
      },
      {
        id: 'type',
        header: 'Type',
        accessorKey: 'type',
        cell: ({ getValue }) => {
          return FEATURE_TYPE_NAMES[getValue() as FeatureType];
        },
      },
      {
        id: 'defaultValue',
        header: 'Default Value',
        accessorKey: 'defaultValue',
        cell: ({ getValue, row }) => (
          <FeatureViewComponent
            value={(getValue() as Feature['defaultValue']).value}
            type={row.getValue('type') as FeatureType}
          />
        ),
      },
      {
        id: 'description',
        header: 'Description',
        accessorKey: 'description',
      },
      {
        id: 'createdAt',
        header: 'Created At',
        accessorKey: 'createdAt',
        cell: function render({ getValue }) {
          return <DateField value={getValue() as string} format="LLL" />;
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        accessorKey: 'id',
        enableColumnFilter: false,
        enableSorting: false,
        cell: function render({ getValue }) {
          return (
            <Group spacing="xs" noWrap>
              <ShowButton hideText recordItemId={getValue() as number} />
              <DeleteButton hideText recordItemId={getValue() as number} />
            </Group>
          );
        },
      },
    ],
    []
  );

  const {
    getHeaderGroups,
    getRowModel,
    refineCore: { setCurrent, pageCount, current },
  } = useTable({
    columns,
    refineCoreProps: {
      metaData: {
        fields: [
          'id',
          'key',
          'type',
          'defaultValue',
          'description',
          'createdAt',
        ],
      },
    },
  });

  const { list } = useNavigation();

  return (
    <ScrollArea>
      <List>
        <Text>
          Manage all of your features by assigning them types and default
          values.
        </Text>
        <Text>
          Group together sets of features with specific defaults into{' '}
          <Text
            span
            c="blue"
            inherit
            style={{ cursor: 'pointer' }}
            onClick={() => list('packages')}
          >
            Packages
          </Text>
          , and assign specific features and/or packages to different{' '}
          <Text
            span
            c="blue"
            inherit
            style={{ cursor: 'pointer' }}
            onClick={() => list('customers')}
          >
            Customers
          </Text>
          .
        </Text>
        <Space h="md" />
        <Table highlightOnHover>
          <thead>
            {getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th key={header.id}>
                      {!header.isPlaceholder && (
                        <Group spacing="xs" noWrap>
                          <Box>
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </Box>
                        </Group>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {getRowModel().rows.map((row) => {
              return (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </Table>
        <br />
        <Pagination
          position="right"
          total={pageCount}
          page={current}
          onChange={setCurrent}
        />
      </List>
    </ScrollArea>
  );
};
