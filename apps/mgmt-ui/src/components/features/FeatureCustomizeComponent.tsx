import { useOne } from '@pankod/refine-core';
import {
  Checkbox,
  Group,
  Text,
  TransferList,
  TransferListItem,
  TransferListItemComponent,
  TransferListItemComponentProps,
} from '@pankod/refine-mantine';
import { useReducer } from 'react';
import { FeatureViewComponent } from './FeatureViewComponent';
import { FeatureEditComponent } from './FeatureEditComponent';
import { FeatureType, FeatureValue, Package } from '@enrolla/graphql-codegen';

type UiRowData = {
  featureValue?: FeatureValue;
  dispatch?: React.Dispatch<ReducerAction>;
} & TransferListItem;

type UiState = [UiRowData[], UiRowData[]];

type ParentConfigReceived = {
  type: 'PARENT_CONFIG_RECEIVED';
  payload: {
    parentConfig: FeatureValue[];
    dispatchFunction: React.Dispatch<ReducerAction>;
  };
};

type TransferListUpdatedAction = {
  type: 'TRANSFER_LIST_UPDATED';
  payload: {
    newUiState: UiState;
  };
};

type FeaureCustomizedAction = {
  type: 'FEATURE_CUSTOMIZED';
  payload: {
    customizedFeature: FeatureValue;
  };
};

type ReducerAction =
  | ParentConfigReceived
  | TransferListUpdatedAction
  | FeaureCustomizedAction;

const prepareFeatures = (
  parentConfig: FeatureValue[],
  customizedFeatures: FeatureValue[],
  dispatch: React.Dispatch<ReducerAction>
): UiState => {
  const preparedAvailableFeatures: UiRowData[] = [];
  const preparedCustomizedFeatures: UiRowData[] = [];

  for (const availableFeature of parentConfig) {
    const customizedFeature = customizedFeatures.find(
      (feature) => feature.feature.id === availableFeature.feature.id
    );

    if (customizedFeature) {
      preparedCustomizedFeatures.push({
        label: availableFeature.feature.key,
        value: availableFeature.feature.key,
        featureValue: {
          feature: availableFeature.feature,
          value: customizedFeature.value,
        },
        dispatch,
      });
    } else {
      preparedAvailableFeatures.push({
        label: availableFeature.feature.key,
        value: availableFeature.feature.key,
        featureValue: { feature: availableFeature.feature, value: null },
        dispatch,
      });
    }
  }

  return [preparedAvailableFeatures, preparedCustomizedFeatures];
};

const ItemComponent: TransferListItemComponent = ({
  data,
  selected,
}: {
  data: UiRowData;
} & TransferListItemComponentProps) => {
  if (!data.featureValue) {
    throw new Error('Feature value is not defined');
  }

  const valueToEdit =
    data.featureValue.feature.type === FeatureType.Json
      ? JSON.stringify(data.featureValue.value?.value)
      : data.featureValue.value?.value;

  return (
    <Group noWrap>
      <Checkbox
        checked={selected}
        tabIndex={-1}
        sx={{ pointerEvents: 'none' }}
        // (To suppress a react warning on a missing onChange; This is handled by the UI Framework)
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onChange={() => {}}
      />
      <div style={{ flex: 1 }}>
        <Text size="sm" weight={500}>
          {data.label}
        </Text>
        <Text size="xs" color="dimmed" weight={400}>
          {data.description}
        </Text>
      </div>
      {data.featureValue.value ? (
        <FeatureEditComponent
          type={data.featureValue.feature.type}
          getInputProps={() => ({
            value: valueToEdit,
            onChange: (
              e: React.FormEvent<HTMLInputElement> | number | string
            ) => {
              if (!data.dispatch) {
                console.log('data.dispatch is not defined');
                return;
              }

              if (!data.featureValue) {
                throw new Error('feature is not defined');
              }

              let customizedValue;
              if (typeof e === 'number') {
                customizedValue = e;
              } else if (typeof e === 'string') {
                customizedValue = e;
              } else {
                customizedValue = e.currentTarget.value;
              }

              if (data.featureValue.feature.type === FeatureType.Json) {
                customizedValue = JSON.parse(customizedValue as string);
              }

              data.dispatch({
                type: 'FEATURE_CUSTOMIZED',
                payload: {
                  customizedFeature: {
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    ...data.featureValue!,
                    value: {
                      value: customizedValue,
                    },
                  },
                },
              });
            },
          })}
        />
      ) : (
        <FeatureViewComponent
          type={data.featureValue.feature.type}
          value={
            data.featureValue.value ??
            data.featureValue.feature.defaultValue.value
          }
          inline
        />
      )}
    </Group>
  );
};

export interface FeatureCustomizeProps {
  parentPackageId: string;
  customizedFeatures: FeatureValue[];
  onCustomizedFeaturesChange: (newCustomizedFeatures: FeatureValue[]) => void;
}

export const FeatureCustomizeComponent = ({
  parentPackageId,
  customizedFeatures,
  onCustomizedFeaturesChange,
}: FeatureCustomizeProps) => {
  const handleAction = (
    [available, customized]: UiState,
    action: ReducerAction
  ): UiState => {
    switch (action.type) {
      case 'PARENT_CONFIG_RECEIVED':
        return prepareFeatures(
          action.payload.parentConfig,
          customizedFeatures,
          action.payload.dispatchFunction
        );

      case 'TRANSFER_LIST_UPDATED': {
        const [newAvailable, newCustomized] = action.payload.newUiState;

        return [
          newAvailable.map((row) => ({
            ...row,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            featureValue: { ...row.featureValue!, value: undefined },
          })),
          newCustomized.map((row) => ({
            ...row,
            featureValue: {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              ...row.featureValue!,
              value: row.featureValue?.feature.defaultValue,
            },
          })),
        ];
      }

      case 'FEATURE_CUSTOMIZED':
        return [
          available,
          customized.map((row) =>
            row.featureValue?.feature.id ===
            action.payload.customizedFeature.feature.id
              ? { ...row, featureValue: action.payload.customizedFeature }
              : { ...row }
          ),
        ];
    }
  };
  const reducer = (state: UiState, action: ReducerAction): UiState => {
    const [newAvailable, newCustomized] = handleAction(state, action);

    if (action.type !== 'PARENT_CONFIG_RECEIVED') {
      onCustomizedFeaturesChange(
        newCustomized.map((feature) => {
          if (!feature.featureValue) {
            throw new Error('Feature value is not defined');
          }
          return feature.featureValue;
        })
      );
    }

    return [newAvailable, newCustomized];
  };

  const [uiState, dispatch] = useReducer(reducer, [[], []]);

  useOne<Package>({
    resource: 'package',
    id: parentPackageId ?? '0',
    metaData: {
      fields: [
        {
          effectiveConfiguration: [
            { feature: ['id', 'key', 'type', 'description'] },
            'value',
          ],
        },
      ],
    },
    queryOptions: {
      onSuccess: ({ data: packagez }) =>
        dispatch({
          type: 'PARENT_CONFIG_RECEIVED',
          payload: {
            parentConfig: packagez.effectiveConfiguration,
            dispatchFunction: dispatch,
          },
        }),
    },
  });

  return (
    <TransferList
      value={uiState}
      onChange={(newUiState) =>
        dispatch({ type: 'TRANSFER_LIST_UPDATED', payload: { newUiState } })
      }
      searchPlaceholder="Search features..."
      listHeight={300}
      titles={['Available Features', 'Customized Features']}
      itemComponent={ItemComponent}
    />
  );
};
