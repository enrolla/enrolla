import { useTable, ColumnDef, flexRender } from '@pankod/refine-react-table';
import {
  Box,
  Group,
  List,
  ScrollArea,
  Table,
  Pagination,
  DeleteButton,
  DateField,
  useModalForm,
  TextInput,
  SaveButton,
  Title,
  Text,
} from '@pankod/refine-mantine';
import { Button, Modal } from '@mantine/core';
import { EncryptionKey, SecretKey } from '@enrolla/graphql-codegen';
import { useMemo, useState } from 'react';
import { useList, useNavigation } from '@pankod/refine-core';

export const SecretKeyList: React.FC = () => {
  const [publicKey, setPublicKey] = useState<string>('avoid_flash');
  useList<EncryptionKey>({
    resource: 'encryptionKeys',
    metaData: { fields: ['publicKey'] },
    queryOptions: {
      onSuccess: ({ data }) => {
        const key: string = data?.[0]?.publicKey;
        setPublicKey(key);
      },
      onError: () => setPublicKey(''),
    },
  });

  const { list } = useNavigation();

  const {
    saveButtonProps,
    getInputProps,
    modal: { show, close, visible },
  } = useModalForm<SecretKey>({
    validate: {
      key: (value) => {
        if (!value) {
          return 'Key is required';
        }
        if (/\s/g.test(value as string)) {
          return 'Key cannot contain whitespaces.';
        }
      },
    },
    validateInputOnBlur: true,
  });

  const columns = useMemo<ColumnDef<SecretKey>[]>(
    () => [
      {
        id: 'key',
        header: 'Key',
        accessorKey: 'key',
        enableColumnFilter: true,
        enableSorting: true,
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
        fields: ['id', 'key', 'createdAt'],
      },
    },
  });

  return (
    <>
      {!publicKey && (
        <Modal
          opened={true}
          closeOnClickOutside={false}
          onClose={() => {}} // eslint-disable-line @typescript-eslint/no-empty-function
          title="No Encryption Keys Found"
        >
          <Text>
            Before creating secrets you must first create your encryption key
            pair.
          </Text>

          <Box mt={8} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              style={{ margin: '15px' }}
              onClick={() => list('encryption-keys')}
            >
              Go To Encryption Key Panel
            </Button>
          </Box>
        </Modal>
      )}

      {publicKey && (
        <>
          <Modal opened={visible} onClose={close} title="Create Secret Key">
            <TextInput
              mt={8}
              label="Key"
              placeholder="secret_key"
              withAsterisk
              {...getInputProps('key')}
            />
            <Box mt={8} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <SaveButton {...saveButtonProps} />
            </Box>
          </Modal>
          <ScrollArea>
            <List
              title={<Title order={3}>Secret Keys</Title>}
              createButtonProps={{ onClick: () => show() }}
            >
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
      )}
    </>
  );
};
