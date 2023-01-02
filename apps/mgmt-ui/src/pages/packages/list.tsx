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
  Card,
  Text,
  createStyles,
  SimpleGrid,
} from '@pankod/refine-mantine';
import { useMemo } from 'react';
import { IPackage } from '../../interfaces';
import {
  PackageIcon,
  PredefinedIcon,
} from '../../components/packages/PackageIcon';

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
  },

  section: {
    borderBottom: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
}));

export const PackageList: React.FC = () => {
  const columns = useMemo<ColumnDef<IPackage>[]>(
    () => [
      {
        id: 'id',
        header: 'ID',
        accessorKey: 'id',
      },
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
        id: 'icon',
        header: 'Icon',
        accessorKey: 'icon',
      },
      {
        id: 'parentPackageId',
        header: 'Parent Package',
        accessorKey: 'parentPackageId',
        cell: function render({ getValue, table }) {
          const parentPackage: IPackage | undefined = table.options.data.find(
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
    refineCoreProps: {
      metaData: {
        fields: ['id', 'name', 'description', 'icon'],
      },
    },
  });

  const { classes } = useStyles();

  return (
    <ScrollArea>
      <List>
        <SimpleGrid
          cols={4}
          breakpoints={[
            { maxWidth: 'sm', cols: 1 },
            { maxWidth: 'lg', cols: 2 },
            { maxWidth: 'xl', cols: 3 },
          ]}
          my={10}
        >
          {getRowModel().rows.map((row, index) => {
            return (
              <Card
                style={{ minHeight: 200 }}
                shadow="sm"
                p="lg"
                radius="md"
                withBorder
                key={row.id}
              >
                <Card.Section className={classes.section}>
                  <Group>
                    <PackageIcon
                      icon={row.getValue('icon') ?? PredefinedIcon.Box}
                    />
                    <Text mt="md" mb="xs" size="xl" weight={500}>
                      {row.getValue('name') as string}
                    </Text>
                  </Group>
                  <Text size="sm" style={{ minHeight: 50 }} color="dimmed">
                    {row.getValue('description') as string}
                  </Text>
                </Card.Section>
                <Group mt="lg">
                  <ShowButton recordItemId={row.getValue('id') as string} />
                  <DeleteButton recordItemId={row.getValue('id') as string} />
                </Group>
              </Card>
            );
          })}
        </SimpleGrid>
      </List>
    </ScrollArea>
  );

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
