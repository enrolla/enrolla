import {
  Button,
  Center,
  Drawer,
  DrawerProps,
  PasswordInput,
  TextInput,
} from '@pankod/refine-mantine';

export const PropelAuthConfigDrawer = (props: DrawerProps) => {
  return (
    <Drawer {...props} title="Configure PropelAuth Integration">
      <TextInput mt={8} label="Domain" />
      <PasswordInput mt={8} label="API Key" />
      <Center mt={16}>
        <Button>Save</Button>
      </Center>
    </Drawer>
  );
};
