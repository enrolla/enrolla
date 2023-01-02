import {
  IconRocket,
  IconCrown,
  IconBusinessplan,
  IconBuildingFactory,
  IconBox,
} from '@tabler/icons';

export enum PredefinedIcon {
  Rocket = 'Rocket',
  Crown = 'Crown',
  Businessplan = 'Businessplan',
  BuildingFactory = 'BuildingFactory',
  Box = 'Box',
}

export const PREDEFINED_ICONS_LABELS: { [key in PredefinedIcon]: string } = {
  Rocket: 'Rocket',
  Crown: 'Crown',
  Businessplan: 'Businessplan',
  BuildingFactory: 'Building Factory',
  Box: 'Box',
};

export const ALL_PREDEFINED_ICONS = Object.values(PredefinedIcon)
  .filter((value) => isNaN(Number(value)))
  .map((value) => String(value) as PredefinedIcon);

export const PackageIcon = ({ icon }: { icon: PredefinedIcon }) => {
  switch (icon) {
    case PredefinedIcon.Rocket:
      return <IconRocket />;
    case PredefinedIcon.Crown:
      return <IconCrown />;
    case PredefinedIcon.Businessplan:
      return <IconBusinessplan />;
    case PredefinedIcon.BuildingFactory:
      return <IconBuildingFactory />;
    case PredefinedIcon.Box:
      return <IconBox />;
  }
};
