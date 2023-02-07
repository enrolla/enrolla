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
  EditButton,
  Text,
  Space,
} from '@pankod/refine-mantine';
import { useMemo } from 'react';
import { Feature, Package } from '@enrolla/graphql-codegen';
import { CustomersEmptyStateComponent } from '../../components/empty-state/EmptyStateComponent';

export const CustomerList: React.FC = () => {
  const columns = useMemo<ColumnDef<Feature>[]>(
    () => [
      {
        id: 'name',
        header: 'Name',
        accessorKey: 'name',
      },
      {
        id: 'package',
        header: 'Package',
        accessorKey: 'package',
        cell: function render({ getValue }) {
          const customerPackage = getValue() as Package | null;
          if (!customerPackage) {
            return null;
          }
          return <span>{customerPackage.name}</span>;
        },
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
              <EditButton hideText recordItemId={getValue() as number} />
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
    refineCore: { setCurrent, pageCount, current, tableQueryResult },
  } = useTable({
    columns,
    refineCoreProps: {
      metaData: {
        fields: [
          'id',
          'organizationId',
          'name',
          { package: ['name'] },
          'createdAt',
        ],
      },
    },
  });

  if (!tableQueryResult.isLoading && !getRowModel().rows.length) {
    return <CustomersEmptyStateComponent />;
  }

  return (
    <ScrollArea>
      <List>
        <Text>
          Manage your customers to override specific features and define secret
          values.
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
