import { Button, Center, TextInput } from '@pankod/refine-mantine';
import {
  IntegrationSetupDrawer,
  IntegrationSetupDrawerProps,
} from './IntegrationSetupDrawer';

export const Auth0ConfigDrawer = (props: IntegrationSetupDrawerProps) => {
  return (
    <IntegrationSetupDrawer
      {...props}
      heading="Set up Auth0 Integration"
      description="By setting up Auth0 integration, you will be able to use your
          exisiting Auth0 organizations as customers"
    >
      <TextInput mt={8} label="Domain" />
      <TextInput mt={8} label="Client ID" />
      <Center mt={16}>
        <Button>Save</Button>
      </Center>
    </IntegrationSetupDrawer>
  );
};
