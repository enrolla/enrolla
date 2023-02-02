import { useLocalStorage } from '@pankod/refine-mantine';
import {
  IconLayoutList,
  IconPackage,
  IconUsers,
  IconShieldLock,
  IconKey,
  IconPuzzle,
  TablerIcon,
} from '@tabler/icons';

export type StepProps = {
  text: string;
  subText: string;
  complete?: boolean;
  icon: TablerIcon;
  time: number;
  link: string;
};

export const onboardingSteps: StepProps[] = [
  {
    text: 'Define Features',
    subText:
      "Add all of your services' features and define their default value",
    icon: IconLayoutList,
    time: 2,
    link: '/features',
  },
  {
    text: 'Setup Packages',
    subText: 'Configure different features values for your packages',
    icon: IconPackage,
    time: 2,
    link: '/packages',
  },
  {
    text: 'Add Customers',
    subText: 'Add a customer and assign them to a package',
    icon: IconUsers,
    time: 5,
    link: '/customers',
  },
  {
    text: 'Generate an Encryption Key',
    subText:
      'Generate an encryption to key to store customer secrets with end-to-end encryption',
    icon: IconShieldLock,
    time: 2,
    link: '/features',
  },
  {
    text: 'Create Secret Keys',
    subText: 'Define which customer secrets you want to store',
    icon: IconKey,
    time: 1,
    link: '/settings/encryption-keys',
  },
  {
    text: 'Integrate with Your Infrastructure',
    subText:
      "Connect to your infrastructure's API to automatically synchronize customers' data",
    icon: IconPuzzle,
    time: 10,
    link: '/integrations',
  },
];

export type OnboardingStatus = {
  minutes: number;
  stepsDone: string[];
};

export const useOnboarding = () => {
  return useLocalStorage<OnboardingStatus>({
    key: 'onboardingStatus',
    defaultValue: { minutes: 0, stepsDone: [] },
    getInitialValueInEffect: true,
  });
};

const totalTime = onboardingSteps.reduce((acc, step) => acc + step.time, 0);

export const useOnboardingPercentage = () => {
  const [onboardingStatus] = useOnboarding();

  return Math.round((onboardingStatus.minutes / totalTime) * 100);
};
