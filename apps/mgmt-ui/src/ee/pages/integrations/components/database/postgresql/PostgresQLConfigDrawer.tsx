import {
  Button,
  Group,
  PasswordInput,
  Stepper,
  TextInput,
} from '@pankod/refine-mantine';
import { MultiSelect, Select } from '@mantine/core';
import { IconDatabaseImport, IconId, IconPlug, IconUsers } from '@tabler/icons';
import { useState } from 'react';
import {
  IntegrationSetupDrawer,
  IntegrationSetupDrawerProps,
} from '../../IntegrationSetupDrawer';
import {
  DbCustomer,
  DbFeatureMetadata,
  FeatureMappingInput,
  FeatureType,
  PostgresQlOptions,
} from '@enrolla/graphql-codegen';
import { useDataProvider, useNavigation } from '@pankod/refine-core';
import { FeaturesMapping } from '../FeaturesMapper';

export const PostgresQLConfigDrawer = (props: IntegrationSetupDrawerProps) => {
  const [active, setActive] = useState(0);
  const [connectionOptions, setConnectionOptions] = useState<PostgresQlOptions>(
    {
      host: '',
      port: null,
      username: null,
      password: null,
      database: '',
      schema: '',
      table: '',
    }
  );
  const [schema, setSchema] = useState<DbFeatureMetadata[]>([]);
  const [organizationIdField, setOrganizationIdField] = useState<
    string | undefined
  >();
  const [customerNameField, setCustomerNameField] = useState<
    string | undefined
  >();
  const [customers, setCustomers] = useState<DbCustomer[]>([]);
  const [organizationIdsToImport, setOrganizationIdsToImport] = useState<
    string[]
  >([]);
  const [featuresMapping, setFeaturesMapping] = useState<Map<string, string>>(
    new Map()
  );
  const { list } = useNavigation();

  const nextStep = () =>
    setActive((current) => (current < 4 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const dataProvider = useDataProvider();
  const { custom } = dataProvider();
  const fetchSchema = async () =>
    custom?.<DbFeatureMetadata[]>({
      url: '',
      method: 'get',
      metaData: {
        operation: 'fetchPostgresSchema',
        fields: ['name', 'type'],
        variables: {
          postgresOptions: {
            value: connectionOptions,
            type: 'PostgresQLOptions',
            required: true,
          },
        },
      },
    }).then((res) => {
      setSchema(res.data);
      nextStep();
    });

  const fetchCusomters = async () =>
    custom?.<DbCustomer[]>({
      url: '',
      method: 'get',
      metaData: {
        operation: 'fetchPostgresCustomers',
        variables: {
          postgresOptions: {
            value: connectionOptions,
            type: 'PostgresQLOptions',
            required: true,
          },
          input: {
            value: {
              organizationIdField,
              customerNameField,
            },
            type: 'FetchCustomersInput',
            required: true,
          },
        },
        fields: ['organizationId', 'name'],
      },
    }).then((res) => {
      setCustomers(res.data);
      nextStep();
    });

  const getFeaturesMapping = (): FeatureMappingInput[] => {
    const features: FeatureMappingInput[] = [];

    featuresMapping.forEach((value, key) => {
      features.push({
        sourceName: key,
        destinationName: value,
        type:
          schema.find((feature) => feature.name === key)?.type ||
          FeatureType.Json,
      });
    });

    return features;
  };

  const importCusomters = async () =>
    custom?.({
      url: '',
      method: 'post',
      metaData: {
        operation: 'importPostgresCustomers',
        variables: {
          postgresOptions: {
            value: connectionOptions,
            type: 'PostgresQLOptions',
            required: true,
          },
          input: {
            value: {
              organizationIdField,
              customerNameField,
              organizationIds: organizationIdsToImport,
              features: getFeaturesMapping(),
            },
            type: 'ImportCustomersInput',
            required: true,
          },
        },
      },
    }).then((res) => {
      if (res.data) {
        list?.('customers');
      }
    });

  const NextStepButton = () => {
    switch (active) {
      case 0:
        return (
          <Button onClick={() => fetchSchema()}>
            {schema ? 'Next' : 'Fetch Schema'}
          </Button>
        );
      case 1:
        return <Button onClick={() => fetchCusomters()}>Next</Button>;
      case 2:
        return <Button onClick={() => nextStep()}>Next</Button>;
      case 3:
        return (
          <Button onClick={() => importCusomters()}>Import & Finish</Button>
        );
      default:
        return <Button onClick={() => nextStep()}>Next</Button>;
    }
  };

  return (
    <IntegrationSetupDrawer
      heading="Set up PostgresDB Integration"
      description="By setting up PostgresDB integration, you will be able to import your
          customers and their features."
      {...props}
    >
      <Stepper
        orientation="vertical"
        size="md"
        iconSize={32}
        active={active}
        onStepClick={setActive}
        mt={40}
      >
        <Stepper.Step
          label="Connect database"
          description="Connect to your PostgresDB, and fetch a collection schema."
          icon={<IconPlug size={18} />}
        >
          <TextInput
            mt={8}
            label="Host"
            value={connectionOptions.host}
            withAsterisk
            onChange={(event) =>
              setConnectionOptions({
                ...connectionOptions,
                host: event.currentTarget.value,
              })
            }
          />
          <TextInput
            mt={8}
            label="Port"
            value={connectionOptions.port?.toString() ?? ''}
            onChange={(event) =>
              setConnectionOptions({
                ...connectionOptions,
                port: Number(event.currentTarget.value),
              })
            }
          />
          <TextInput
            mt={8}
            label="Username"
            value={connectionOptions.username ?? ''}
            onChange={(event) =>
              setConnectionOptions({
                ...connectionOptions,
                username: event.currentTarget.value,
              })
            }
          />
          <PasswordInput
            mt={8}
            label="Password"
            value={connectionOptions.password ?? ''}
            onChange={(event) =>
              setConnectionOptions({
                ...connectionOptions,
                password: event.currentTarget.value,
              })
            }
          />
          <TextInput
            mt={8}
            label="Database Name"
            value={connectionOptions.database}
            withAsterisk
            onChange={(event) =>
              setConnectionOptions({
                ...connectionOptions,
                database: event.currentTarget.value,
              })
            }
          />
          <TextInput
            mt={8}
            label="Schema Name"
            value={connectionOptions.schema ?? ''}
            withAsterisk
            onChange={(event) =>
              setConnectionOptions({
                ...connectionOptions,
                schema: event.currentTarget.value,
              })
            }
          />
          <TextInput
            mt={8}
            label="Table Name"
            value={connectionOptions.table ?? ''}
            withAsterisk
            onChange={(event) =>
              setConnectionOptions({
                ...connectionOptions,
                table: event.currentTarget.value,
              })
            }
          />
        </Stepper.Step>
        <Stepper.Step
          label="Identify customers"
          description="Select a field from the schema that identifies your customers."
          icon={<IconId size={18} />}
        >
          <Select
            label="Organization ID Field"
            defaultValue={schema[0]?.name}
            data={schema.map((featureMetadata) => featureMetadata.name)}
            onChange={(value) => value && setOrganizationIdField(value)}
          />
          <Select
            label="Organization Name Field"
            defaultValue={schema[0]?.name}
            data={schema.map((featureMetadata) => featureMetadata.name)}
            onChange={(value) => value && setCustomerNameField(value)}
          />
        </Stepper.Step>

        <Stepper.Step
          label="Select customers"
          description="Select the customers that you want to import."
          icon={<IconUsers size={18} />}
        >
          <MultiSelect
            label="Select customers"
            data={customers.map((customer) => {
              return {
                label: customer.name,
                value: customer.organizationId,
              };
            })}
            onChange={(value) => value && setOrganizationIdsToImport(value)}
          />
        </Stepper.Step>

        <Stepper.Step
          label="Import customers"
          description="Select the fields that you want to import as features and import them."
          icon={<IconDatabaseImport size={18} />}
        >
          <FeaturesMapping
            featureNames={schema
              .filter(
                (feature) =>
                  feature.name !== organizationIdField &&
                  feature.name !== customerNameField
              )
              .map((feature) => feature.name)}
            featureNamesMapping={featuresMapping}
            setFeaturesMapping={setFeaturesMapping}
          />
        </Stepper.Step>
      </Stepper>

      <Group position="right" mt="xl">
        <Button variant="default" onClick={prevStep}>
          Back
        </Button>
        <NextStepButton />
      </Group>
    </IntegrationSetupDrawer>
  );
};
