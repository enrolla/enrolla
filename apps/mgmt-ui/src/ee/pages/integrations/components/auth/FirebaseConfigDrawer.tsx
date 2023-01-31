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
import { ConfigureFirebaseOrganizationManagerInput } from '@enrolla/graphql-codegen';
import { useDataProvider, useNotification } from '@pankod/refine-core';
import { errorNotification, responseNotification } from './utils';

export const FirebaseConfigDrawer = (props: IntegrationSetupDrawerProps) => {
  const [integrationInput, setIntegrationInput] =
    useState<ConfigureFirebaseOrganizationManagerInput>({
      projectId: '',
      clientEmail: '',
      privateKey: '',
    });

  const { open } = useNotification();

  const dataProvider = useDataProvider();
  const { custom } = dataProvider();
  const setIntegration = async () =>
    custom?.({
      url: '',
      method: 'post',
      metaData: {
        operation: 'configureFirebaseOrganizationManager',
        variables: {
          input: {
            value: integrationInput,
            type: 'ConfigureFirebaseOrganizationManagerInput',
            required: true,
          },
        },
      },
    })
      .then(({ data }) => {
        responseNotification(data as unknown as boolean, open, props.onClose);
      })
      .catch(() => {
        open?.(errorNotification());
      });

  return (
    <IntegrationSetupDrawer
      {...props}
      heading="Set up Firebase Integration"
      description="By setting up Firebase integration, you will be able to use your
          existing Firebase organizations as customers"
    >
      <TextInput
        mt={8}
        label="Project Id"
        value={integrationInput.projectId}
        onChange={(event) =>
          setIntegrationInput({
            ...integrationInput,
            projectId: event.currentTarget.value,
          })
        }
      />

      <TextInput
        mt={8}
        label="Client Email"
        value={integrationInput.clientEmail}
        onChange={(event) =>
          setIntegrationInput({
            ...integrationInput,
            clientEmail: event.currentTarget.value,
          })
        }
      />

      <PasswordInput
        mt={8}
        label="Private Key"
        value={integrationInput.privateKey}
        onChange={(event) =>
          setIntegrationInput({
            ...integrationInput,
            privateKey: event.currentTarget.value,
          })
        }
      />

      <Center mt={16}>
        <Button onClick={setIntegration}>Save</Button>
      </Center>
    </IntegrationSetupDrawer>
  );
};
