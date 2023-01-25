import { ConfigurePropelauthOrganizationManagerInput } from '@enrolla/graphql-codegen';
import { useDataProvider } from '@pankod/refine-core';
import {
  Button,
  Center,
  PasswordInput,
  TextInput,
} from '@pankod/refine-mantine';
import { useState } from 'react';
import {
  IntegrationSetupDrawer,
  IntegrationSetupDrawerProps,
} from '../IntegrationSetupDrawer';

export const PropelAuthConfigDrawer = (props: IntegrationSetupDrawerProps) => {
  const [integrationInput, setIntegrationInput] =
    useState<ConfigurePropelauthOrganizationManagerInput>({
      domain: '',
      apiKey: '',
    });

  const dataProvider = useDataProvider();
  const { custom } = dataProvider();
  const setIntegration = async () =>
    custom?.({
      url: '',
      method: 'post',
      metaData: {
        operation: 'configurePropelauthOrganizationManager',
        variables: {
          input: {
            value: integrationInput,
            type: 'ConfigurePropelauthOrganizationManagerInput',
            required: true,
          },
        },
      },
    });

  return (
    <IntegrationSetupDrawer
      {...props}
      heading="Set up PropelAuth Integration"
      description="By setting up PropelAuth integration, you will be able to use your
          exisiting Auth0 organizations as customers"
    >
      <TextInput
        mt={8}
        label="Domain"
        value={integrationInput.domain}
        onChange={(event) =>
          setIntegrationInput({
            ...integrationInput,
            domain: event.currentTarget.value,
          })
        }
      />

      <PasswordInput
        mt={8}
        label="API Key"
        value={integrationInput.apiKey}
        onChange={(event) =>
          setIntegrationInput({
            ...integrationInput,
            apiKey: event.currentTarget.value,
          })
        }
      />
      <Center mt={16}>
        <Button
          onClick={() => {
            setIntegration();
            props.onClose();
          }}
        >
          Save
        </Button>
      </Center>
    </IntegrationSetupDrawer>
  );
};
