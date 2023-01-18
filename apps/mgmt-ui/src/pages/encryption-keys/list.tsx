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
  useModalForm,
  TextInput,
  SaveButton,
  Title,
  Button,
} from '@pankod/refine-mantine';
import { Modal } from '@mantine/core';
import { EncryptionKey } from '@enrolla/graphql-codegen';
import { useMemo, useState } from 'react';
import { IconCopy } from '@tabler/icons';
import { useList } from '@pankod/refine-core';
import { generateKeyPair } from './encryption';

const keyDisplayValue = (key: string) => {
  try {
    return `****${key.substring(key.length - 4, key.length)}`;
  } catch {
    return '****';
  }
};

export const EncryptionKeyList: React.FC = () => {
  const {
    values,
    getInputProps,
    setValues,
    saveButtonProps,
    modal: { show, close, visible },
  } = useModalForm<EncryptionKey>({
    refineCoreProps: {
      action: 'create',
    },
    validate: {
      publicKey: (value) => {
        if (!value) {
          return 'Public Key is required';
        }
      },
    },
    transformValues: (values) => {
      return {
        // dont send private key to server
        publicKey: values.publicKey,
      };
    },
  });

  const [hasSecrets, setHasSecrets] = useState<boolean>(false);
  useList({
    resource: 'hasSecrets',
    queryOptions: {
      onSuccess: ({ data }) => {
        console.log('hasSecrets: ', data);
        setHasSecrets(data as unknown as boolean);
      },
    },
  });

  const columns = useMemo<ColumnDef<EncryptionKey>[]>(
    () => [
      {
        id: 'publicKey',
        header: 'Public Key',
        accessorKey: 'publicKey',
        cell: function render({ getValue }) {
          return <Text>{keyDisplayValue(getValue() as string)}</Text>;
        },
      },
      {
        id: 'privteKey',
        header: 'Private Key',
        accessorKey: 'privateKey',
        cell: function render() {
          return (
            <Tooltip label="Your private key is known only to you. Its not stored on Enrolla servers.">
              <Text>****</Text>
            </Tooltip>
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
            <Tooltip
              label={
                hasSecrets
                  ? 'You must not have any customer secrets defined in order to delete the key pair.'
                  : 'Delete Key Pair'
              }
            >
              <Group spacing="xs" noWrap>
                <DeleteButton
                  hideText
                  recordItemId={getValue() as number}
                  confirmTitle="This action cannot be undone! Ensure your private key is not in use."
                  confirmOkText="I'm sure, delete it."
                  confirmCancelText="Nevermind, don't delete."
                  disabled={hasSecrets}
                />
              </Group>
            </Tooltip>
          );
        },
      },
    ],
    []
  );

  const generateKeys = async () => {
    const keyPair = await generateKeyPair();
    console.log(keyPair.privateKey);
    setValues({ publicKey: keyPair.publicKey, privateKey: keyPair.privateKey });
    setValues({ publicKey: 'publicSet', privateKey: 'priv set' });
  };

  const {
    getHeaderGroups,
    getRowModel,
    refineCore: { setCurrent, pageCount, current },
  } = useTable({
    columns,
    refineCoreProps: {
      metaData: {
        fields: ['id', 'publicKey', 'createdAt'],
      },
    },
  });

  return (
    <>
      <Modal opened={visible} onClose={close} title="Create Encryption Keys">
        <TextInput
          mt={8}
          label="Public Key:"
          {...getInputProps('publicKey')}
          disabled
        />
        <TextInput
          mt={8}
          label="Private Key:"
          {...getInputProps('privateKey')}
          disabled
        />
        <br />
        <>
          <Button.Group mt={8} sx={{ justifyContent: 'center' }}>
            <>
              {values.publicKey ? (
                <>
                  <CopyButton value={values.publicKey as string}>
                    {({ copied, copy }) => (
                      <Button
                        variant="light"
                        leftIcon={<IconCopy />}
                        color={copied ? 'teal' : 'blue'}
                        onClick={copy}
                      >
                        {copied ? 'Copied' : 'Copy Private Key'}
                      </Button>
                    )}
                  </CopyButton>
                  <br />
                </>
              ) : (
                <Button
                  disabled={!!values.publicKey}
                  onClick={() => generateKeys()}
                >
                  Generate Keys
                </Button>
              )}
            </>
          </Button.Group>

          <br />
          {values.publicKey && (
            <Text color="red">
              You must copy your private key and store it securly. It will not
              be shown again!
            </Text>
          )}
        </>
        <br />
        <Box mt={8} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <SaveButton {...saveButtonProps} />
        </Box>
      </Modal>

      <ScrollArea>
        <List
          title={<Title order={3}>Encryption Keys</Title>}
          canCreate={!getRowModel()?.rows?.length}
          createButtonProps={{ onClick: () => show() }}
        >
          <Text>
            Note: Only one encryption key pair can be created per account.
          </Text>
          <br />
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
