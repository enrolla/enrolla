import { Customer, FeatureValue, Package } from '@enrolla/graphql-codegen';
import {
  Select,
  useSelect,
  Edit,
  useForm,
  Title,
} from '@pankod/refine-mantine';
import { FeatureCustomizeComponent } from '../../components/features/FeatureCustomizeComponent';

export const CustomerEdit: React.FC = () => {
  const {
    saveButtonProps,
    values,
    setValues,
    refineCore: { queryResult },
  } = useForm<Customer>({
    refineCoreProps: {
      metaData: {
        fields: [
          'name',
          'organizationId',
          {
            features: [{ feature: ['id'] }, 'value'],
            package: ['id'],
          },
        ],
      },
    },
    initialValues: {
      features: [],
      package: { id: '' },
    },
    transformValues: (values) => {
      console.log(values);
      return {
        features: (values.features as FeatureValue[]).map((fv) => ({
          featureId: fv.feature.id,
          value: fv.value,
        })),
        packageId: values['package.id'] as string,
      };
    },
  });

  const { selectProps: selectPackageProps } = useSelect<Package>({
    resource: 'packages',
    optionLabel: 'name',
    metaData: {
      fields: ['id', 'name'],
    },
    defaultValue: queryResult?.data?.data.package?.id,
  });

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Title>{queryResult?.data?.data.name}</Title>
      <Select
        mt={8}
        mb={8}
        label="Package"
        placeholder="Pick one"
        value={(values['package'] as Package | null)?.id}
        onChange={(value) => {
          setValues({ package: { id: value } });
        }}
        {...selectPackageProps}
      />
      <FeatureCustomizeComponent
        parentPackageId={values['package.id'] as string}
        customizedFeatures={values['features'] as FeatureValue[]}
        onCustomizedFeaturesChange={(newCustomizedFeatures) => {
          setValues({ features: newCustomizedFeatures });
        }}
      />
    </Edit>
  );
};
