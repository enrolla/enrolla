import {
  Button,
  Center,
  Modal,
  ModalProps,
  PasswordInput,
  TextInput,
} from '@pankod/refine-mantine';

export const MongoDBConfigModal = (props: ModalProps) => {
  return (
    <Modal {...props} title="Configure MongoDB Integration">
      <TextInput mt={8} label="Host" />
      <TextInput mt={8} label="Username" />
      <PasswordInput mt={8} label="Password" />
      <TextInput mt={8} label="Database Name" />
      <TextInput mt={8} label="Collection Name" />
      <TextInput mt={8} label="Organization ID field name" />
      <Center mt={16}>
        <Button>Save</Button>
      </Center>
    </Modal>
  );
};
