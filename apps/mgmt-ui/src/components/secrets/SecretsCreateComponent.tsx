import { SecretKey, SecretInput } from '@enrolla/graphql-codegen';
import { useNavigation } from '@pankod/refine-core';
import { Space, TextInput, Text, SimpleGrid } from '@pankod/refine-mantine';

export interface SecretsCreateProps {
  secretKeys: SecretKey[];
  secrets: SecretInput[];
  onSecretsChange: (secrets: Partial<SecretInput>[]) => void;
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
      delete stateMap[key];
      onSecretsChange(Object.values(stateMap));
    } else {
      onSecretsChange(Object.values({ ...stateMap, [key]: { key, value } }));
    }
  };

  const { list } = useNavigation();

  return (
    <>
      <Text>Input secret values for your defined secret keys.</Text>
      <Text>
        Secret keys can be managed from the{' '}
        <Text
          span
          c="blue"
          inherit
          style={{ cursor: 'pointer' }}
          onClick={() => list('secret-keys')}
        >
          Secret Key Dashboard
        </Text>
        .
      </Text>
      <Space h="md" />
      <SimpleGrid cols={2} spacing="md">
        {secretKeys.map((sk: SecretKey) => {
          return (
            <div key={sk.key}>
              <TextInput
                style={{ width: '80%' }}
                label={sk.key}
                value={stateMap[sk.key]?.value}
                onChange={(event) => updateValue(sk.key, event.target.value)}
              />
              <Space h="md" />
            </div>
          );
        })}
      </SimpleGrid>
    </>
  );
};
