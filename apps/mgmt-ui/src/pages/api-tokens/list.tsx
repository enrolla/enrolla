import { useTable, ColumnDef, flexRender } from '@pankod/refine-react-table';
import {
  Box,
  Text,
  Group,
  List,
  ScrollArea,
  Table,
  Pagination,
  DeleteButton,
  DateField,
  CopyButton,
  Tooltip,
  ActionIcon,
  useModalForm,
  TextInput,
  SaveButton,
  Title,
  Space,
} from '@pankod/refine-mantine';
import { Flex, Modal } from '@mantine/core';
import { ApiToken } from '@enrolla/graphql-codegen';
import { useMemo } from 'react';
import { IconCopy, IconCheck } from '@tabler/icons';

const tokenDisplayValue = (tokenValue: string) => {
  try {
    return `****${tokenValue.substring(
      tokenValue.length - 4,
      tokenValue.length
    )}`;
  } catch {
    return '****';
  }
};

export const ApiTokenList: React.FC = () => {
  const {
    saveButtonProps,
    getInputProps,
    modal: { show, close, visible },
  } = useModalForm<ApiToken>({
    refineCoreProps: {
      action: 'create',
      successNotification: () => {
        return {
          message: `API Token created successfully.`,
          type: 'success',
        };
      },
    },
    validate: {
      name: (value) => {
        if (!value) {
          return 'Name is required';
        }
      },
    },
    validateInputOnBlur: true,
  });
  const columns = useMemo<ColumnDef<ApiToken>[]>(
    () => [
      {
        id: 'name',
        header: 'Name',
        accessorKey: 'name',
      },
      {
        id: 'token',
        header: 'Token Value',
        accessorKey: 'token',
        cell: function render({ getValue }) {
          const tokenValue = getValue() as string;
          return (
            <Flex justify="flex-start" align="flex-start" direction="row">
              <Text style={{ width: '75px' }}>
                {tokenDisplayValue(tokenValue)}
              </Text>
              <CopyButton value={tokenValue} timeout={2000}>
                {({ copied, copy }) => (
                  <Tooltip
                    label={copied ? 'Copied' : 'Copy'}
                    withArrow
                    position="right"
                  >
                    <ActionIcon color={copied ? 'teal' : 'gray'} onClick={copy}>
                      {copied ? (
                        <IconCheck size={16} />
                      ) : (
                        <IconCopy size={16} />
                      )}
                    </ActionIcon>
                  </Tooltip>
                )}
              </CopyButton>
            </Flex>
          );
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
              <DeleteButton
                hideText
                recordItemId={getValue() as number}
                confirmTitle="This action cannot be undone! Make sure your API Token is not is use in your application before deleting it."
                confirmOkText="I'm sure, delete it."
                confirmCancelText="Nevermind, don't delete."
              />
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
        fields: ['id', 'name', 'token', 'createdAt'],
      },
    },
  });

  return (
    <>
      <Modal opened={visible} onClose={close} title="Create API Token">
        <TextInput
          mt={8}
          label="Name"
          placeholder="Token Name"
          withAsterisk
          {...getInputProps('name')}
        />
        <Box mt={8} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <SaveButton {...saveButtonProps} />
        </Box>
      </Modal>
      <ScrollArea>
        <List
          title={<Title order={3}>API Tokens</Title>}
          createButtonProps={{ onClick: () => show() }}
        >
          <Text>
            Create and manage API tokens for authenticated communication between
            the Enrolla SDK and server.
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
    </>
  );
};
