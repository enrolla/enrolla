import 'regenerator-runtime/runtime';
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  useAsyncDebounce,
} from 'react-table';

import {
  Box,
  Group,
  List,
  ScrollArea,
  Table,
  ShowButton,
  DeleteButton,
  DateField,
  Text,
  Space,
  Center,
  createStyles,
  TextInput,
} from '@pankod/refine-mantine';
import { Feature, FeatureType } from '@enrolla/graphql-codegen';
import { useMemo, useState } from 'react';
import {
  FeatureViewComponent,
  FEATURE_TYPE_NAMES,
} from '../../components/features/FeatureViewComponent';
import { useNavigation, useList } from '@pankod/refine-core';
import { FeaturesEmptyStateComponent } from '../../components/empty-state/EmptyStateComponent';
import { IconSelector, IconChevronDown, IconChevronUp, IconSearch } from '@tabler/icons';


const useStyles = createStyles((theme) => ({
  title: {
    color: theme.colorScheme === 'dark' ? '#FFFFFF' : '#38404E',
    fontSize: 60,
    fontWeight: 800,
    [theme.fn.smallerThan('sm')]: {
      fontSize: 42,
    },
    margin: '80px 0 0 50px',
  },

  description: {
    color: theme.colorScheme === 'dark' ? '#A9ACB7' : '#38404E',
    maxWidth: '500px',
    margin: '25px 0 0 50px',
  },

  searchBar: {
    width: '60%',
    margin: '20px 0 0 50px',
  },

  table: {
    width: '90%',
    margin: '20px 0 0 50px',
  },

  button: {
    background: '#9376EF',
    margin: '30px 0 0 50px',
    minWidth: '190px',
    fontWeight: 100,

    '&:hover': {
      boxShadow: theme.shadows.sm,
      background: '#9376EF',
    },
  },

  th: {
    padding: '0 !important',
  },

  control: {
    width: '100%',
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    },
  },

  icon: {
    width: 21,
    height: 21,
    borderRadius: 21,
  },
}));
  
// Define a default UI for filtering
function GlobalFilter({
  globalFilter,
  setGlobalFilter,
}) {
  const { classes } = useStyles();

  const [value, setValue] = useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
      <TextInput
      className={classes.searchBar}
        value={value || ''}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        icon={<IconSearch size={14} stroke={1.5} />}
        placeholder="Search Features"
      />
  );
}

export const FeatureList: React.FC = () => {
  const columns = useMemo(
    () => [
      {
        Header: 'Key',
        accessor: 'key',
      },
      {
        Header: 'Type',
        accessor: 'type',
        Cell: ({ value }) => {
          return FEATURE_TYPE_NAMES[value as FeatureType];
        },
      },
      {
        Header: 'Default Value',
        accessor: 'defaultValue',
        Cell: ({ value, row }) => (
          <FeatureViewComponent
            value={(value as Feature['defaultValue']).value}
            type={row.value as FeatureType}
          />
        ),
      },
      {
        Header: 'Description',
        accessor: 'description',
      },
      {
        Header: 'Created At',
        accessor: 'createdAt',
        sortBy: 'datetime',
        Cell: function render({ value }) {
          return <DateField value={value as string} format="LLL" />;
        },
      },
      {
        id: 'actions',
        Header: 'Actions',
        accessor: 'id',
        Cell: function render({ value }) {
          return (
            <Group spacing="xs" noWrap>
              <ShowButton hideText recordItemId={value as number} />
              <DeleteButton hideText recordItemId={value as number} />
            </Group>
          );
        },
      },
    ],
    []
  );

  const { data: featureList } = useList<Feature>({
    resource: 'features',
    metaData: {
      fields: ['id', 'key', 'type', 'defaultValue', 'description', 'createdAt'],
    },
  });

  const data = useMemo(() => featureList?.data || [], [featureList]);

  // console.log('data', data);

  //   if (!featureList?.data?.length) {
  //   return <FeaturesEmptyStateComponent />;
  // }

  const {
    getTableProps,
    prepareRow,
    getTableBodyProps,
    headerGroups,
    rows,
    state,
    visibleColumns,
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable<Feature>(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy,

  );

  const { list } = useNavigation();

  const { classes } = useStyles();

  // if (!tableQueryResult.isLoading && !getRowModel().rows.length) {
  //   return <FeaturesEmptyStateComponent />;
  // }

  return (
    <ScrollArea>
      <List title='lala'>
        <Text className={classes.description}>
          Manage all of your features by assigning them types and default
          values. Group together sets of features with specific defaults into{' '}
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
        <GlobalFilter
          globalFilter={state.globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
        <Table className={classes.table} highlightOnHover {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                {headerGroup.headers.map((column) => {
                    const Icon = column.isSorted ? (column.isSortedDesc ? IconChevronUp : IconChevronDown) : IconSelector;

                  return (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      key={column.id}
                    >
                      <Group spacing="xs" noWrap>
                        <Box>{column.render('Header')}</Box>
                        <Center className={classes.icon}>
                        <Icon size={14} stroke={1.5} />
                        </Center>
                      </Group>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} key={row.id}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </Table>
        <br />
      </List>
    </ScrollArea>
  );
};
