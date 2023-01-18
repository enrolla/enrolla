import { SecretKey, SecretInput } from '@enrolla/graphql-codegen';
import {
  Space,
  TextInput,
  Text,
  Group,
  Badge,
  Button,
  Modal,
} from '@pankod/refine-mantine';
import { useModal } from '@pankod/refine-core';
import { useState } from 'react';

const STATUS = {
  NOT_DEFINED: 'NOT_DEFINED',
  EDITED: 'EDITED',
  UNCHANGED: 'UNCHANGED',
} as const;

type Status = typeof STATUS[keyof typeof STATUS];

const statusCompare = (a: Status, b: Status) => {
  if (a === b) {
    return 0;
  }
  if (a === STATUS.EDITED) {
    return -1;
  }
  if (b === STATUS.EDITED) {
    return 1;
  }
  if (a === STATUS.NOT_DEFINED) {
    return -1;
  }
  if (b === STATUS.NOT_DEFINED) {
    return 1;
  }
  return 0;
};

interface DisplaySecret extends SecretInput {
  status: Status;
}

const arrToMap = (arr: SecretInput[], status: Status) =>
  arr.reduce((acc, s) => {
    acc[s.key] = {
      ...s,
      status,
    };
    return acc;
  }, {} as Record<string, DisplaySecret>);

const SecretBadge = ({ secret }: { secret: DisplaySecret }) => {
  let badgeColor: string;
  let badgeText: string;
  switch (secret.status) {
    case STATUS.EDITED:
      badgeColor = 'orange';
      badgeText = 'Edited';
      break;
    case STATUS.NOT_DEFINED:
      badgeColor = 'red';
      badgeText = 'Not Defined';
      break;
    default:
      badgeColor = 'green';
      badgeText = 'Unchanged';
  }

  return (
    <Badge style={{ width: '10% ' }} color={badgeColor}>
      {badgeText}
    </Badge>
  );
};

export interface SecretsEditProps {
  secretKeys: SecretKey[];
  existingSecrets: SecretInput[];
  editedSecrets: SecretInput[];
  onSecretsChange: (secrets: SecretInput[]) => void;
}

interface SecretDisplayAndEditProps {
  onUpdate: (key: string, value: string) => void;
  onUndo: (key: string) => void;
  secret: DisplaySecret;
}

const SecretDisplayAndEditComponent = ({
  onUpdate,
  onUndo,
  secret,
}: SecretDisplayAndEditProps) => {
  const { show, close, visible } = useModal();
  const [editedValue, setEditedValue] = useState('');

  return (
    <>
      <Modal
        opened={visible}
        onClose={() => {
          close();
          setEditedValue('');
        }}
        title="Edit Secret Value"
      >
        <TextInput value={secret.key} readOnly label="Key:" />
        <Space h="sm" />
        <TextInput
          onChange={(event) => setEditedValue(event.target.value)}
          value={editedValue}
          label="New Value:"
          description="New value for the secret. Will overwrite the existing value."
          withAsterisk
        />
        <Space h="lg" />
        <Group position="center">
          <Button
            color="indigo"
            onClick={() => {
              onUpdate(secret.key, editedValue);
              close();
              setEditedValue('');
            }}
          >
            Update
          </Button>
        </Group>
      </Modal>
      <Group>
        <Text style={{ width: '25%' }}>{secret.key}</Text>
        <SecretBadge secret={secret} />
        <Button color="indigo" size="xs" compact onClick={() => show()}>
          Edit
        </Button>
        {secret.status == STATUS.EDITED && (
          <Button
            color="orange"
            size="xs"
            compact
            onClick={() => onUndo(secret.key)}
          >
            Undo
          </Button>
        )}
      </Group>
    </>
  );
};

export const SecretsEditComponent = ({
  secretKeys = [],
  existingSecrets,
  editedSecrets,
  onSecretsChange,
}: SecretsEditProps) => {
  const editedSecretMap = arrToMap(editedSecrets, STATUS.EDITED);

  const displaySecretMap = arrToMap(existingSecrets, STATUS.UNCHANGED);
  for (let sk of secretKeys) {
    // Add any missing keys, which are not in the existing secrets
    const k = sk.key;
    if (!displaySecretMap[k]) {
      displaySecretMap[k] = { key: k, value: '', status: STATUS.NOT_DEFINED };
    }
  }
  for (let es of editedSecrets) {
    // Override with edited secrets
    displaySecretMap[es.key] = { ...es, status: STATUS.EDITED };
  }

  const displayArr = Object.values(displaySecretMap).sort((a, b) =>
    statusCompare(a.status, b.status)
  );

  const onUpdate = (key: string, value: string) => {
    if (!value) {
      return;
    }
    onSecretsChange(
      Object.values({ ...editedSecretMap, [key]: { key, value } })
    );
  };

  const onUndo = (key: string) => {
    delete editedSecretMap[key];
    onSecretsChange(Object.values(editedSecretMap));
  };

  return (
    <>
      {displayArr.map((secret: DisplaySecret) => {
        return (
          <>
            <SecretDisplayAndEditComponent
              onUndo={onUndo}
              onUpdate={onUpdate}
              secret={secret}
            />
            <Space h="md" />
          </>
        );
      })}
    </>
  );
};
