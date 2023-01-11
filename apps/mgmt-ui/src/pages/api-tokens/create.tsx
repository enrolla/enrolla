import { Create, TextInput, useForm } from '@pankod/refine-mantine';
import { IApiToken } from '../../interfaces';

export const ApiTokenCreate: React.FC = () => {
  const { saveButtonProps, getInputProps, values, setFieldValue } =
    useForm<IApiToken>({
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
    <Create saveButtonProps={saveButtonProps}>
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
