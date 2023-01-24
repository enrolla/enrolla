import {
  Button,
  Center,
  PasswordInput,
  TextInput,
} from '@pankod/refine-mantine';
import {
  IntegrationSetupDrawer,
  IntegrationSetupDrawerProps,
} from './IntegrationSetupDrawer';

export const PropelAuthConfigDrawer = (props: IntegrationSetupDrawerProps) => {
  return (
    <IntegrationSetupDrawer
      {...props}
      heading="Set up PropelAuth Integration"
      description="By setting up PropelAuth integration, you will be able to use your
          exisiting Auth0 organizations as customers"
    >
      <TextInput mt={8} label="Domain" />
      <PasswordInput mt={8} label="API Key" />
      <Center mt={16}>
        <Button>Save</Button>
      </Center>
    </IntegrationSetupDrawer>
  );
};
