import {
  Button,
  Checkbox,
  Group,
  PasswordInput,
  Stepper,
  Text,
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
  DbFeatureMetadata,
  MongoDbConnectionOptions,
} from '@enrolla/graphql-codegen';
import { useCustom, useDataProvider } from '@pankod/refine-core';

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
  const [idFieldName, setIdFieldName] = useState<string | undefined>();
  const [customerIds, setCustomerIds] = useState<string[]>([]);

  const nextStep = () =>
    setActive((current) => (current < 4 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const nextStepButton = () => {
    switch (active) {
      case 0:
        return 'Fetch Schema';
      case 1:
        return 'Select';
      case 2:
        return 'Next';
      case 3:
        return 'Import & Finish';
      default:
        return 'Next';
    }
  };

  const dataProvider = useDataProvider();
  const { custom } = dataProvider();
  const fetchSchema = async () =>
    custom?.<DbFeatureMetadata[]>({
      url: '',
      method: 'get',
      metaData: {
        operation: 'mongoSchema',
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

  const getCustomerIds = async () =>
    custom?.<string[]>({
      url: '',
      method: 'get',
      metaData: {
        operation: 'mongoCustomerIds',
        variables: {
          input: {
            value: connectionOptions,
            type: 'MongoDBConnectionOptions',
            required: true,
          },
          idFieldName: {
            value: idFieldName,
            type: 'String',
            required: true,
          },
        },
      },
    }).then((res) => {
      setCustomerIds(res.data);
      nextStep();
    });

  const NextButton = () => {
    switch (active) {
      case 0:
        return (
          <Button onClick={() => fetchSchema()}>
            {schema ? 'Next' : 'Fetch Schema'}
          </Button>
        );
      case 1:
        return <Button onClick={() => getCustomerIds()}>Next</Button>;
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
            defaultValue={schema[0]?.name}
            data={schema.map((featureMetadata) => featureMetadata.name)}
            onChange={(value) => value && setIdFieldName(value)}
          />
        </Stepper.Step>

        <Stepper.Step
          label="Select customers"
          description="Select the customers that you want to import."
          icon={<IconUsers size={18} />}
        >
          <MultiSelect defaultValue={customerIds} data={customerIds} />
        </Stepper.Step>

        <Stepper.Step
          label="Import customers"
          description="Select the fields that you want to import as features and import them."
          icon={<IconDatabaseImport size={18} />}
        >
          <MultiSelect
            data={schema
              .filter((feature) => feature.name !== idFieldName)
              .map((feature) => feature.name)}
          />
        </Stepper.Step>
      </Stepper>

      <Group position="right" mt="xl">
        <Button variant="default" onClick={prevStep}>
          Back
        </Button>
        <NextButton />
      </Group>
    </IntegrationSetupDrawer>
  );
};
