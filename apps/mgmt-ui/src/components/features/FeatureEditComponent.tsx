import {
  Checkbox,
  JsonInput,
  NumberInput,
  TextInput,
} from '@pankod/refine-mantine';
import { GetInputPropsType } from '@mantine/form/lib/types';
import { FeatureType } from '@enrolla/graphql-codegen';

export interface FeatureEditComponentProps {
  type: FeatureType;
  label?: string;
  getInputProps: (props?: { type: GetInputPropsType }) => object;
}

export const FeatureEditComponent = ({
  type,
  label,
  getInputProps,
}: FeatureEditComponentProps) => {
  switch (type) {
    case FeatureType.Boolean:
      return (
        <Checkbox
          mt={8}
          label={`${label} (true/false)`}
          {...getInputProps({ type: 'checkbox' })}
        />
      );

    case FeatureType.Integer:
    case FeatureType.Float:
      return (
        <NumberInput
          mt={8}
          label={label}
          hideControls
          noClampOnBlur={type === FeatureType.Float}
          {...getInputProps()}
        />
      );

    case FeatureType.Json:
      return (
        <JsonInput
          mt={8}
          label={label}
          validationError="Invalid json"
          formatOnBlur
          autosize
          minRows={4}
          {...getInputProps()}
        />
      );

    default:
      return <TextInput mt={8} label={label} {...getInputProps()} />;
  }
};
