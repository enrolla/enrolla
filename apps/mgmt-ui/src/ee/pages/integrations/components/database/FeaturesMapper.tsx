import { Checkbox, Flex, TextInput } from '@mantine/core';
import { useState } from 'react';

export interface FeatureMapperProps {
  featureName: string;
  setFeatureMapping: (sourceName: string, destName: string) => void;
  removeFeatureMapping: (sourceName: string) => void;
}

export const FeatureMapper = (props: FeatureMapperProps) => {
  const [checked, setChecked] = useState(false);
  const [value, setValue] = useState(props.featureName);

  return (
    <Flex direction="column" mt={20}>
      <Checkbox
        size="xs"
        label={props.featureName}
        onChange={(event) => {
          setChecked(event.target.checked);

          if (event.target.checked) {
            props.setFeatureMapping(props.featureName, value);
          } else {
            props.removeFeatureMapping(props.featureName);
          }
        }}
      />
      <TextInput
        defaultValue={props.featureName}
        size="xs"
        onChange={(event) => {
          setValue(event.target.value);

          if (checked) {
            props.setFeatureMapping(props.featureName, event.target.value);
          }
        }}
      />
    </Flex>
  );
};

export interface FeaturesMappingProps {
  featureNames: string[];
  featureNamesMapping: Map<string, string>;
  setFeaturesMapping: (featureNamesMapping: Map<string, string>) => void;
}

export const FeaturesMapping = (props: FeaturesMappingProps) => {
  const setFeatureMapping = (sourceName: string, destName: string) => {
    const newMap = new Map(props.featureNamesMapping);
    newMap.set(sourceName, destName);
    props.setFeaturesMapping(newMap);
  };

  const removeFeatureMapping = (sourceName: string) => {
    const newMap = new Map(props.featureNamesMapping);
    newMap.delete(sourceName);
    props.setFeaturesMapping(newMap);
  };

  return (
    <>
      {props.featureNames.map((featureName) => (
        <FeatureMapper
          featureName={featureName}
          setFeatureMapping={setFeatureMapping}
          removeFeatureMapping={removeFeatureMapping}
        />
      ))}
    </>
  );
};
