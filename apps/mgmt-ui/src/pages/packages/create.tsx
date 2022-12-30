import {
  Button,
  Create,
  Group,
  SaveButton,
  Select,
  Stack,
  Stepper,
  Text,
  Textarea,
  TextInput,
  Title,
  useSelect,
  useStepsForm,
} from '@pankod/refine-mantine';
import { useState } from 'react';
import { FeatureCustomizeComponent } from '../../components/features/FeatureCustomizeComponent';
import { IPackage } from '../../interfaces';
import { CustomizedFeature } from '../../interfaces/features.interface';

export const PackageCreate: React.FC = () => {
  const {
    saveButtonProps,
    getInputProps,
    values,
    setValues,
    steps: { currentStep, gotoStep },
  } = useStepsForm<IPackage>({
    initialValues: {
      features: [],
      parentPackageId: null,
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

  const { selectProps } = useSelect({
    resource: 'packages',
    optionLabel: 'name',
  });

  const [customizedFeatures, setCustomizedFeatures] = useState(
    values['features'] as CustomizedFeature[]
  );

  return (
    <Create // Next, previous and save buttons
      footerButtons={
        <Group position="right" mt="xl">
          {currentStep !== 0 && (
            <Button variant="default" onClick={() => gotoStep(currentStep - 1)}>
              Back
            </Button>
          )}
          {currentStep !== 2 && (
            <Button onClick={() => gotoStep(currentStep + 1)}>Next step</Button>
          )}
          {currentStep === 2 && <SaveButton {...saveButtonProps} />}
        </Group>
      }
    >
      <Stepper active={currentStep} breakpoint="sm">
        <Stepper.Step label="Basic Info">
          <TextInput
            mt={8}
            label="Name"
            placeholder="name"
            withAsterisk
            {...getInputProps('name')}
          />
          <Textarea
            mt={8}
            label="Description"
            placeholder="Desciption"
            autosize
            {...getInputProps('description')}
          />
          <Select
            mt={8}
            label="Inherits from package"
            placeholder="Pick one"
            {...getInputProps('parentPackageId')}
            {...selectProps}
          />
        </Stepper.Step>
        <Stepper.Step label="Customize Features">
          <FeatureCustomizeComponent
            customizedFeatures={customizedFeatures}
            onCustomizedFeaturesChange={(newCustomizedFeatures) => {
              setCustomizedFeatures(newCustomizedFeatures);
              setValues({ features: newCustomizedFeatures });
            }}
          />
        </Stepper.Step>
        <Stepper.Step label="Summary">
          <Stack mt={16}>
            <>
              <Title>{values['name'] as string}</Title>
              <Text> {values['description'] as string}</Text>
            </>
          </Stack>
        </Stepper.Step>
      </Stepper>
    </Create>
  );
};
