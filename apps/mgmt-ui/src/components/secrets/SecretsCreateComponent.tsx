import { SecretKey, SecretInput } from '@enrolla/graphql-codegen';
import { Space, TextInput } from '@pankod/refine-mantine';

export interface SecretsCreateProps {
  secretKeys: SecretKey[];
  secrets: SecretInput[];
  onSecretsChange: (secrets: SecretInput[]) => void;
}

export const SecretsCreateComponent = ({
  secretKeys = [],
  secrets,
  onSecretsChange,
}: SecretsCreateProps) => {
  const stateMap = secrets.reduce((acc, s) => {
    acc[s.key] = s;
    return acc;
  }, {} as Record<string, SecretInput>);

  const updateValue = (key: string, value: string) => {
    if (!value) {
      return;
    }
    onSecretsChange(Object.values({ ...stateMap, [key]: { key, value } }));
  };

  return (
    <>
      {secretKeys.map((sk: SecretKey) => {
        return (
          <>
            <TextInput
              style={{ width: '33%' }}
              label={sk.key}
              value={stateMap[sk.key]?.value}
              onChange={(event) => updateValue(sk.key, event.target.value)}
            />
            <Space h="md" />
          </>
        );
      })}
    </>
  );
};
