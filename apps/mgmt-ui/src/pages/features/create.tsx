import {
  Create,
  SegmentedControl,
  Textarea,
  TextInput,
  useForm,
} from '@pankod/refine-mantine';
import { FeatureEditComponent } from '../../components/features/FeatureEditComponent';
import { IFeature } from '../../interfaces';
import { FeatureType } from '../../interfaces/features.interface';

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
        defaultValue: {
          value:
            values['type'] === 'JSON'
              ? JSON.parse(values['defaultValue'] as string)
              : values['defaultValue'],
        },
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
        <FeatureEditComponent
          type={values['type'] as FeatureType}
          label="Default Value"
          getInputProps={(options) => getInputProps('defaultValue', options)}
        />
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
