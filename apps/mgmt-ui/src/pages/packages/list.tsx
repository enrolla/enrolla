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
} from '@pankod/refine-mantine';
import { useMemo } from 'react';
import { IPackage } from '../../interfaces';

export const PackageList: React.FC = () => {
  const columns = useMemo<ColumnDef<IPackage>[]>(
    () => [
      {
        id: 'name',
        header: 'Name',
        accessorKey: 'name',
      },
      {
        id: 'description',
        header: 'Description',
        accessorKey: 'description',
      },
      {
        id: 'parentPackageId',
        header: 'Parent Package',
        accessorKey: 'parentPackageId',
        cell: function render({ getValue, table }) {
          const parentPackage = table.options.data.find(
            (item) => item.id === getValue()
          );
          return parentPackage?.name ?? '-';
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
  });

  return (
    <ScrollArea>
      <List>
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
