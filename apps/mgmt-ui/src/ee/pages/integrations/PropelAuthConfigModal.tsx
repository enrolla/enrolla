import {
  Button,
  Center,
  Modal,
  ModalProps,
  PasswordInput,
  TextInput,
} from '@pankod/refine-mantine';

export const PropelAuthConfigModal = (props: ModalProps) => {
  return (
    <Modal {...props} title="Configure PropelAuth Integration">
      <TextInput mt={8} label="Domain" />
      <PasswordInput mt={8} label="API Key" />
      <Center mt={16}>
        <Button>Save</Button>
      </Center>
    </Modal>
  );
};
