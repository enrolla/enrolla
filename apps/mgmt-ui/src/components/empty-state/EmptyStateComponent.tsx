import { useNavigation } from '@pankod/refine-core';
import {
  Title,
  Text,
  useMantineColorScheme,
  Button,
  Image,
  createStyles,
  Center,
} from '@pankod/refine-mantine';
import featuresDark from '../../assets/empty-state/FeaturesDark.svg';
import featuresLight from '../../assets/empty-state/FeaturesLight.svg';
import customersDark from '../../assets/empty-state/CustomersDark.svg';
import customersLight from '../../assets/empty-state/CustomersLight.svg';
import packagesDark from '../../assets/empty-state/PackagesDark.svg';
import packagesLight from '../../assets/empty-state/PackagesLight.svg';
import secretsDark from '../../assets/empty-state/SecretsDark.svg';
import secretsLight from '../../assets/empty-state/SecretsLight.svg';

interface EmptyStateComponentProps {
  title: string;
  description: string;
  buttonText: string;
  onCreate: () => void;
  svgLight: any;
  svgDark: string;
}

const useStyles = createStyles((theme) => ({
  title: {
    color: theme.colorScheme === 'dark' ? '#FFFFFF' : '#38404E',
    fontSize: 60,
    fontWeight: 800,
    [theme.fn.smallerThan('sm')]: {
      fontSize: 42,
    },
    margin: '80px 0 0 50px',
  },

  description: {
    color: theme.colorScheme === 'dark' ? '#A9ACB7' : '#38404E',
    maxWidth: '500px',
    margin: '25px 0 0 50px',
  },
  button: {
    background: '#9376EF',
    margin: '30px 0 0 50px',
    minWidth: '190px',
    fontWeight: 100,

    '&:hover': {
      boxShadow: theme.shadows.sm,
      background: '#9376EF',
    },
  },

  image: {
    maxWidth: '500px',
  },
}));

export const EmptyStateComponent = ({
  title,
  description,
  onCreate,
  buttonText,
  svgLight,
  svgDark,
}: EmptyStateComponentProps) => {
  const { classes } = useStyles();

  const { colorScheme } = useMantineColorScheme();

  return (
    <>
      <Title className={classes.title}>{title}</Title>
      <Text className={classes.description}>{description}</Text>
      <Button className={classes.button} onClick={onCreate}>
        {buttonText}
      </Button>
      <Center>
        <Image
          className={classes.image}
          height={500}
          fit="contain"
          src={colorScheme === 'dark' ? svgDark : svgLight}
        />
      </Center>
    </>
  );
};

export const FeaturesEmptyStateComponent = () => {
  const { create } = useNavigation();

  return (
    <EmptyStateComponent
      title="No Features Yet!"
      description="Manage all of your features by assigning them types and default values. Group together sets of features with specific defaults into packages, and assign specific features and/or packages to different customers."
      buttonText="Add Feature"
      onCreate={() => create('features')}
      svgLight={featuresLight}
      svgDark={featuresDark}
    />
  );
};

export const CustomersEmptyStateComponent = () => {
  const { create } = useNavigation();

  return (
    <EmptyStateComponent
      title="No Customers Yet!"
      description="Manage your customers to override specific features and define secret values."
      buttonText="Add Customer"
      onCreate={() => create('customers')}
      svgLight={customersLight}
      svgDark={customersDark}
    />
  );
};

export const PackagesEmptyStateComponent = () => {
  const { create } = useNavigation();

  return (
    <EmptyStateComponent
      title="No Packages Yet!"
      description="Group together sets of features with specific defaults into packages, and assign specific packages to different customers."
      buttonText="Add Package"
      onCreate={() => create('packages')}
      svgLight={packagesLight}
      svgDark={packagesDark}
    />
  );
};

export const SecretKeysEmptyStateComponent = ({
  onCreate,
}: {
  onCreate: () => void;
}) => {
  return (
    <EmptyStateComponent
      title="No Secret Keys Yet!"
      description="Create or delete secret keys. Secret values are defined per customer in the Customer Dashboard. Secret values are encrypted and can be decrypted only by using your private key (which is known only to you)."
      buttonText="Add Key"
      onCreate={onCreate}
      svgLight={secretsLight}
      svgDark={secretsDark}
    />
  );
};
