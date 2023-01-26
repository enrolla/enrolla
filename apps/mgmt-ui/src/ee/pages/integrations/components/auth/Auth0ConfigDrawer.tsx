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
import { ConfigureAuth0OrganizationManagerInput } from '@enrolla/graphql-codegen';
import { useDataProvider, useNotification } from '@pankod/refine-core';

export const Auth0ConfigDrawer = (props: IntegrationSetupDrawerProps) => {
  const [integrationInput, setIntegrationInput] =
    useState<ConfigureAuth0OrganizationManagerInput>({
      domain: '',
      clientId: '',
      clientSecret: '',
    });

  const { open } = useNotification();

  const dataProvider = useDataProvider();
  const { custom } = dataProvider();
  const setIntegration = async () =>
    custom?.({
      url: '',
      method: 'post',
      metaData: {
        operation: 'configureAuth0OrganizationManager',
        variables: {
          input: {
            value: integrationInput,
            type: 'ConfigureAuth0OrganizationManagerInput',
            required: true,
          },
        },
      },
    })
      .then(() => {
        open?.({
          message: 'Successfully configured Auth0 integration',
          type: 'success',
        });
        props.onClose();
      })
      .catch(() => {
        open?.({
          message: 'Failed to configure Auth0 integration',
          type: 'error',
        });
      });

  return (
    <IntegrationSetupDrawer
      {...props}
      heading="Set up Auth0 Integration"
      description="By setting up Auth0 integration, you will be able to use your
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

      <TextInput
        mt={8}
        label="Client ID"
        value={integrationInput.clientId}
        onChange={(event) =>
          setIntegrationInput({
            ...integrationInput,
            clientId: event.currentTarget.value,
          })
        }
      />

      <PasswordInput
        mt={8}
        label="Client Secret"
        value={integrationInput.clientSecret}
        onChange={(event) =>
          setIntegrationInput({
            ...integrationInput,
            clientSecret: event.currentTarget.value,
          })
        }
      />

      <Center mt={16}>
        <Button onClick={setIntegration}>Save</Button>
      </Center>
    </IntegrationSetupDrawer>
  );
};
