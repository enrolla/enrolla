import {
  Edit,
  Group,
  Select,
  Text,
  Textarea,
  TextInput,
  useForm,
  useSelect,
} from '@pankod/refine-mantine';
import { FeatureCustomizeComponent } from '../../components/features/FeatureCustomizeComponent';
import {
  PackageIcon,
  PredefinedIcon,
  ALL_PREDEFINED_ICONS,
  PREDEFINED_ICONS_LABELS,
} from '../../components/packages/PackageIcon';
import { forwardRef } from 'react';
import { FeatureValue, Package } from '@enrolla/graphql-codegen';

interface PackageIconItemProps extends React.ComponentPropsWithoutRef<'div'> {
  label: string;
  value: PredefinedIcon;
}

const PackageIconItemComponent = forwardRef<
  HTMLDivElement,
  PackageIconItemProps
>(({ label, value, ...props }: PackageIconItemProps, ref) => (
  <div ref={ref} {...props}>
    <Group noWrap>
      <PackageIcon icon={value} />
      <div>
        <Text size="sm">{label}</Text>
      </div>
    </Group>
  </div>
));

export const PackageEdit: React.FC = () => {
  const {
    saveButtonProps,
    getInputProps,
    values,
    setValues,
    refineCore: { queryResult },
  } = useForm<Package>({
    refineCoreProps: {
      metaData: {
        fields: [
          'name',
          'icon',
          'description',
          {
            features: [{ feature: ['id'] }, 'value'],
            parentPackage: ['id'],
          },
        ],
      },
    },
    initialValues: {
      name: '',
      icon: PredefinedIcon.Rocket,
      description: '',
      features: [],
      parentPackage: { id: '' },
    },
    transformValues: (values) => ({
      name: values.name,
      icon: values.icon,
      description: values.description,
      parentPackageId: values['parentPackage.id'] as string,
      features: (values.features as FeatureValue[]).map((fv) => ({
        featureId: fv.feature.id,
        value: fv.value,
      })),
      updateStrategy: 'MIGRATE_ALL_CHILDREN',
    }),
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
    metaData: {
      fields: ['id', 'name'],
    },
    defaultValue: queryResult?.data?.data.parentPackage?.id,
  });

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <TextInput
        mt={8}
        label="Name"
        placeholder="name"
        withAsterisk
        {...getInputProps('name')}
      />
      <Select
        mt={8}
        label="Icon"
        placeholder="Pick one"
        data={ALL_PREDEFINED_ICONS.map((icon) => ({
          label: PREDEFINED_ICONS_LABELS[icon],
          value: icon,
        }))}
        itemComponent={PackageIconItemComponent}
        {...getInputProps('icon')}
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
        mb={16}
        label="Extends package"
        placeholder="Pick one"
        {...getInputProps('parentPackage.id')}
        {...selectProps}
      />
      <FeatureCustomizeComponent
        parentPackageId={(values.parentPackage as Package).id as string}
        customizedFeatures={values['features'] as FeatureValue[]}
        onCustomizedFeaturesChange={(newCustomizedFeatures) => {
          setValues({ features: newCustomizedFeatures });
        }}
      />
    </Edit>
  );
};
