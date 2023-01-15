import {
  Button,
  Center,
  Modal,
  ModalProps,
  TextInput,
} from '@pankod/refine-mantine';

export const Auth0ConfigModal = (props: ModalProps) => {
  return (
    <Modal {...props} title="Configure Auth0 Integration">
      <TextInput mt={8} label="Domain" />
      <TextInput mt={8} label="Client ID" />
      <Center mt={16}>
        <Button>Save</Button>
      </Center>
    </Modal>
  );
};
