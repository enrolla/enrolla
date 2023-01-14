import { Create, TextInput, useForm } from '@pankod/refine-mantine';
import { ApiToken } from '@enrolla/graphql-codegen';

export const ApiTokenCreate: React.FC = () => {
  const { saveButtonProps, getInputProps } = useForm<ApiToken>({
    refineCoreProps: {
      successNotification: () => {
        return {
          message: `API Token created successfully.`,
          type: 'success',
        };
      },
    },
    validate: {
      name: (value) => {
        if (!value) {
          return 'Name is required';
        }
      },
    },
    validateInputOnBlur: true,
  });

  return (
    <Create title="Api Token" saveButtonProps={saveButtonProps}>
      <form>
        <TextInput
          mt={8}
          label="Name"
          placeholder="Token Name"
          withAsterisk
          {...getInputProps('name')}
        />
      </form>
    </Create>
  );
};
