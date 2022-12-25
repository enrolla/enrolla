import {
  Checkbox,
  Create,
  JsonInput,
  NumberInput,
  SegmentedControl,
  Textarea,
  TextInput,
  useForm,
} from '@pankod/refine-mantine';
import { IFeature } from '../../interfaces';

export const FeatureCreate: React.FC = () => {
  const { saveButtonProps, getInputProps, values, setFieldValue } =
    useForm<IFeature>({
      initialValues: {
        type: 'STRING',
      },
      validate: {
        key: (value) => {
          if (!value) {
            return 'Key is required';
          }
        },
      },
      validateInputOnBlur: true,
      transformValues: (values) => ({
        ...values,
        defaultValue:
          values['type'] === 'JSON'
            ? JSON.parse(values['defaultValue'] as string)
            : values['defaultValue'],
      }),
    });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <form>
        <SegmentedControl
          mt={8}
          radius="xl"
          size="md"
          {...getInputProps('type')}
          onChange={(value) => {
            setFieldValue('type', value);
            setFieldValue('defaultValue', '');
          }}
          data={[
            { label: 'Integer', value: 'INTEGER' },
            { label: 'Float', value: 'FLOAT' },
            { label: 'String', value: 'STRING' },
            { label: 'Boolean', value: 'BOOLEAN' },
            { label: 'Json', value: 'JSON' },
          ]}
        />
        <TextInput
          mt={8}
          label="Key"
          placeholder="key"
          withAsterisk
          {...getInputProps('key')}
        />
        {values['type'] === 'BOOLEAN' && (
          <Checkbox
            mt={8}
            label="Defaults to true"
            {...getInputProps('defaultValue', { type: 'checkbox' })}
          />
        )}
        {(values['type'] === 'INTEGER' || values['type'] === 'FLOAT') && (
          <NumberInput
            mt={8}
            label="Default Value"
            hideControls
            noClampOnBlur={values['type'] === 'FLOAT'}
            {...getInputProps('defaultValue')}
          />
        )}
        {values['type'] === 'STRING' && (
          <TextInput
            mt={8}
            label="Default Value"
            {...getInputProps('defaultValue')}
          />
        )}
        {values['type'] === 'JSON' && (
          <JsonInput
            mt={8}
            label="Default Value"
            validationError="Invalid json"
            formatOnBlur
            autosize
            minRows={4}
            {...getInputProps('defaultValue')}
          />
        )}
        <Textarea
          mt={8}
          label="Description"
          placeholder="Desciption"
          autosize
          {...getInputProps('description')}
        />
      </form>
    </Create>
  );
};
