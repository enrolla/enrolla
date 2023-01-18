import {
  Customer,
  EncryptionKey,
  FeatureValue,
  Package,
  SecretInput,
  SecretKey,
} from '@enrolla/graphql-codegen';
import { useList } from '@pankod/refine-core';
import {
  Select,
  useSelect,
  Edit,
  useForm,
  Title,
  Space,
} from '@pankod/refine-mantine';
import { FeatureCustomizeComponent } from '../../components/features/FeatureCustomizeComponent';
import { SecretsEditComponent } from '../../components/secrets/SecretsEditComponent';
import { encrypt } from '../../utils/encryption';

export const CustomerEdit: React.FC = () => {
  const {
    saveButtonProps,
    values,
    setValues,
    refineCore: { queryResult },
  } = useForm<Customer>({
    refineCoreProps: {
      metaData: {
        fields: [
          'name',
          'organizationId',
          {
            features: [{ feature: ['id'] }, 'value'],
            package: ['id'],
            secrets: ['key', 'value'],
          },
        ],
      },
    },
    initialValues: {
      features: [],
      package: { id: '' },
      secrets: [],
      editedSecrets: [],
    },
    transformValues: (values) => {
      return {
        features: (values.features as FeatureValue[]).map((fv) => ({
          featureId: fv.feature.id,
          value: fv.value,
        })),
        packageId: values['package.id'] as string,
        secrets: (values.editedSecrets as SecretInput[]).map((s) => ({
          key: s.key,
          ...encrypt(s.value, encryptionKey?.data[0]?.publicKey),
          new: !(values.secrets as SecretInput[])?.find(
            (existingSecret) => existingSecret.key === s.key
          ),
        })),
      };
    },
  });

  const { selectProps: selectPackageProps } = useSelect<Package>({
    resource: 'packages',
    optionLabel: 'name',
    metaData: {
      fields: ['id', 'name'],
    },
    defaultValue: queryResult?.data?.data.package?.id,
  });

  const { data: secretKeys } = useList<SecretKey>({
    resource: 'secret-keys',
    metaData: {
      fields: ['key'],
    },
  });

  const { data: encryptionKey } = useList<EncryptionKey>({
    resource: 'encryption-keys',
    metaData: {
      fields: ['publicKey'],
    },
  });

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Title>{queryResult?.data?.data.name}</Title>
      <Select
        mt={8}
        mb={8}
        label="Package"
        placeholder="Pick one"
        value={(values['package'] as Package | null)?.id}
        onChange={(value) => {
          setValues({ package: { id: value } });
        }}
        {...selectPackageProps}
      />
      <Space h="md" />
      <Title order={3}>Edit Features</Title>
      <FeatureCustomizeComponent
        parentPackageId={values['package.id'] as string}
        customizedFeatures={values['features'] as FeatureValue[]}
        onCustomizedFeaturesChange={(newCustomizedFeatures) => {
          setValues({ features: newCustomizedFeatures });
        }}
      />
      <Space h="md" />
      <Title order={3}>Edit Secrets</Title>
      <SecretsEditComponent
        secretKeys={secretKeys?.data as SecretKey[]}
        existingSecrets={values['secrets'] as SecretInput[]}
        editedSecrets={values['editedSecrets'] as SecretInput[]}
        onSecretsChange={(newSecrets) => {
          setValues({ editedSecrets: newSecrets });
        }}
      />
    </Edit>
  );
};
