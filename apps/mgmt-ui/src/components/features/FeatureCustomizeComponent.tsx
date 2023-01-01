import { useList } from '@pankod/refine-core';
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
import { IFeature } from '../../interfaces';
import {
  CustomizedFeature,
  FeatureValue,
} from '../../interfaces/features.interface';
import { FeatureViewComponent } from './FeatureViewComponent';
import { FeatureEditComponent } from './FeatureEditComponent';

type UiRowData = {
  customizedValue?: { value: FeatureValue };
} & TransferListItem &
  Partial<IFeature>;

type UiState = [UiRowData[], UiRowData[]];

type AvailableFeaturesReceived = {
  type: 'AVAILABLE_FEATURES_RECEIVED';
  payload: {
    availableFeatures: IFeature[];
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
    featureId: string;
    customizedValue: FeatureValue;
  };
};

type ReducerAction =
  | AvailableFeaturesReceived
  | TransferListUpdatedAction
  | FeaureCustomizedAction;

const prepareFeatures = (
  receivedFeatures: IFeature[],
  customizedFeatures: CustomizedFeature[]
): UiState => {
  const preparedAvailableFeatures: UiRowData[] = [];
  const preparedCustomizedFeatures: UiRowData[] = [];

  for (const availableFeature of receivedFeatures) {
    const customizedFeature = customizedFeatures.find(
      (feature) => feature.featureId === availableFeature.key
    );

    if (customizedFeature) {
      preparedCustomizedFeatures.push({
        ...availableFeature,
        label: availableFeature.key,
        value: availableFeature.key,
        customizedValue: customizedFeature.value,
      });
    }

    preparedAvailableFeatures.push({
      ...availableFeature,
      label: availableFeature.key,
      value: availableFeature.key,
    });
  }

  return [preparedAvailableFeatures, preparedCustomizedFeatures];
};

export interface FeatureCustomizeProps {
  customizedFeatures: CustomizedFeature[];
  onCustomizedFeaturesChange: (
    newCustomizedFeatures: CustomizedFeature[]
  ) => void;
}

export const FeatureCustomizeComponent = ({
  customizedFeatures,
  onCustomizedFeaturesChange,
}: FeatureCustomizeProps) => {
  const handleAction = (
    [available, customized]: UiState,
    action: ReducerAction
  ): UiState => {
    switch (action.type) {
      case 'AVAILABLE_FEATURES_RECEIVED':
        return prepareFeatures(
          action.payload.availableFeatures,
          customizedFeatures
        );

      case 'TRANSFER_LIST_UPDATED': {
        const [newAvailable, newCustomized] = action.payload.newUiState;

        return [
          newAvailable.map((feature) => ({
            ...feature,
            customizedValue: undefined,
          })),
          newCustomized.map((feature) => ({
            ...feature,
            customizedValue: feature.defaultValue,
          })),
        ];
      }

      case 'FEATURE_CUSTOMIZED':
        return [
          available,
          customized.map((feature) =>
            feature.id === action.payload.featureId
              ? {
                  ...feature,
                  customizedValue: { value: action.payload.customizedValue },
                }
              : { ...feature }
          ),
        ];
    }
  };
  const reducer = (state: UiState, action: ReducerAction): UiState => {
    const [newAvailable, newCustomized] = handleAction(state, action);

    if (action.type !== 'AVAILABLE_FEATURES_RECEIVED') {
      onCustomizedFeaturesChange(
        newCustomized.map((feature) => {
          if (!feature.id || !feature.defaultValue) {
            throw new Error('Feature id or default value is not defined');
          }
          return {
            featureId: feature.id,
            value: feature.customizedValue ?? feature.defaultValue,
          };
        })
      );
    }

    return [newAvailable, newCustomized];
  };

  const [uiState, dispatch] = useReducer(reducer, [[], []]);

  const ItemComponent: TransferListItemComponent = ({
    data,
    selected,
  }: {
    data: UiRowData;
  } & TransferListItemComponentProps) => {
    if (!data.type || !data.defaultValue) {
      throw new Error('Feature type or default value is not defined');
    }

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
        {data.customizedValue ? (
          <FeatureEditComponent
            type={data.type}
            getInputProps={() => ({
              value: data.customizedValue?.value,
              onChange: (
                e: React.FormEvent<HTMLInputElement> | number | string
              ) => {
                if (!data.id) {
                  throw new Error('feature id is not defined');
                }

                let customizedValue;
                if (typeof e === 'number') {
                  customizedValue = e;
                } else if (typeof e === 'string') {
                  customizedValue = e;
                } else {
                  customizedValue = e.currentTarget.value;
                }

                dispatch({
                  type: 'FEATURE_CUSTOMIZED',
                  payload: {
                    featureId: data.id,
                    customizedValue,
                  },
                });
              },
            })}
          />
        ) : (
          <FeatureViewComponent
            type={data.type}
            value={data.defaultValue.value}
            inline
          />
        )}
      </Group>
    );
  };

  useList<IFeature>({
    resource: 'features',
    metaData: {
      fields: ['id', 'key', 'defaultValue', 'type', 'description'],
    },
    queryOptions: {
      onSuccess: ({ data: availableFeatures }) =>
        dispatch({
          type: 'AVAILABLE_FEATURES_RECEIVED',
          payload: { availableFeatures },
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
