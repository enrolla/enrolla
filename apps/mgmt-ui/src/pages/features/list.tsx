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
} from '@pankod/refine-mantine';
import { Prism } from '@mantine/prism';
import { FeatureType, IFeature } from '../../interfaces';
import { useMemo } from 'react';
import { FEATURE_TYPE_NAMES } from './feature-type-translator';

export const FeatureList: React.FC = () => {
  const columns = useMemo<ColumnDef<IFeature>[]>(
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
        cell: ({ getValue, row }) => {
          if (row.getValue('type') === FEATURE_TYPE_NAMES.JSON) {
            return (
              <Prism language="json" noCopy>
                {JSON.stringify((getValue() as IFeature['defaultValue']).value)}
              </Prism>
            );
          } else {
            return (
              <Text>
                {JSON.stringify((getValue() as IFeature['defaultValue']).value)}
              </Text>
            );
          }
        },
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
