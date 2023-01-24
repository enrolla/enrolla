import {
  Button,
  Checkbox,
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
} from '../IntegrationSetupDrawer';
import {
  DbCustomer,
  DbFeatureMetadata,
  MongoDbConnectionOptions,
} from '@enrolla/graphql-codegen';
import { useDataProvider } from '@pankod/refine-core';

export const MongoDBConfigDrawer = (props: IntegrationSetupDrawerProps) => {
  const [active, setActive] = useState(0);
  const [connectionOptions, setConnectionOptions] =
    useState<MongoDbConnectionOptions>({
      host: '',
      isSrv: false,
      username: null,
      password: null,
      database: '',
      collection: '',
    });
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
        operation: 'fetchMongoSchema',
        fields: ['name', 'type'],
        variables: {
          input: {
            value: connectionOptions,
            type: 'MongoDBConnectionOptions',
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
        operation: 'fetchMongoCustomers',
        variables: {
          input: {
            value: {
              connectionOptions,
              organizationIdField,
              customerNameField,
            },
            type: 'FetchMongoCustomersInput',
            required: true,
          },
        },
        fields: ['organizationId', 'name'],
      },
    }).then((res) => {
      setCustomers(res.data);
      nextStep();
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
        return <Button onClick={() => nextStep()}>Import & Finish</Button>;
      default:
        return <Button onClick={() => nextStep()}>Next</Button>;
    }
  };

  return (
    <IntegrationSetupDrawer
      heading="Set up MongoDB Integration"
      description="By setting up MongoDB integration, you will be able to import your
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
          description="Connect to your MongoDB, and fetch a collection schema."
          icon={<IconPlug size={18} />}
        >
          <TextInput
            mt={8}
            label="Host"
            value={connectionOptions.host}
            onChange={(event) =>
              setConnectionOptions({
                ...connectionOptions,
                host: event.currentTarget.value,
              })
            }
          />
          <Checkbox mt={8} label="SRV" />
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
            onChange={(event) =>
              setConnectionOptions({
                ...connectionOptions,
                database: event.currentTarget.value,
              })
            }
          />
          <TextInput
            mt={8}
            label="Collection Name"
            value={connectionOptions.collection ?? ''}
            onChange={(event) =>
              setConnectionOptions({
                ...connectionOptions,
                collection: event.currentTarget.value,
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
          <MultiSelect
            label="Select feature fields"
            data={schema
              .filter(
                (feature) =>
                  feature.name !== organizationIdField &&
                  feature.name !== customerNameField
              )
              .map((feature) => feature.name)}
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
