import { Authenticated } from '@pankod/refine-core';
import {
  Card,
  createStyles,
  SimpleGrid,
  Image,
  Badge,
  Group,
  Title,
  Text,
} from '@pankod/refine-mantine';
import postgres from '../../assets/integrations/postgres.svg';
import mysql from '../../assets/integrations/mysql.svg';
import auth0 from '../../assets/integrations/auth0.svg';
import workos from '../../assets/integrations/workos.svg';
import firebase from '../../assets/integrations/firebase.svg';
import salesforce from '../../assets/integrations/salesforce.svg';
import hubspot from '../../assets/integrations/hubspot.svg';

enum IntegrationType {
  CRM = 'CRM',
  Database = 'Database',
  Authentication = 'Authentication',
}

type Integration = {
  title: string;
  image: string;
  type: IntegrationType;
};

const integrations: Integration[] = [
  {
    title: 'PostgreSQL',
    image: postgres,
    type: IntegrationType.Database,
  },
  {
    title: 'MySQL',
    image: mysql,
    type: IntegrationType.Database,
  },
  {
    title: 'Auth0',
    image: auth0,
    type: IntegrationType.Authentication,
  },
  {
    title: 'WorkOS',
    image: workos,
    type: IntegrationType.Authentication,
  },
  {
    title: 'Firebase',
    image: firebase,
    type: IntegrationType.Authentication,
  },
  {
    title: 'Salesforce',
    image: salesforce,
    type: IntegrationType.CRM,
  },
  {
    title: 'HubSpot',
    image: hubspot,
    type: IntegrationType.CRM,
  },
];

const useStyles = createStyles((theme) => ({
  title: {
    fontSize: 34,
    fontWeight: 900,
    [theme.fn.smallerThan('sm')]: {
      fontSize: 24,
    },
  },

  description: {
    maxWidth: 600,
    margin: 'auto',

    '&::after': {
      content: '""',
      display: 'block',
      backgroundColor: theme.fn.primaryColor(),
      width: 45,
      height: 2,
      marginTop: theme.spacing.sm,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  card: {
    transition: 'transform 150ms ease, box-shadow 150ms ease',

    '&:hover': {
      boxShadow: theme.shadows.sm,
    },
  },
}));

export const Integrations = () => {
  const { classes } = useStyles();

  const colors: { [key in IntegrationType]: string } = {
    Authentication: 'red',
    Database: 'pink',
    CRM: 'blue',
  };

  const cards = integrations.map((integration: Integration) => (
    <Card withBorder radius="md" className={classes.card}>
      <Image src={integration.image} height={40} fit="contain" />
      <Group position="apart" mt="lg">
        <Title order={6} weight={500}>
          {integration.title}
        </Title>
        <Badge color={colors[integration.type]}>{integration.type}</Badge>
      </Group>
    </Card>
  ));

  return (
    <Authenticated>
      <Card>
        <Group position="center">
          <Badge variant="filled" size="lg">
            Integrations
          </Badge>
        </Group>
        <Title order={2} className={classes.title} align="center" mt="sm">
          Integrate with your existing stack
        </Title>
        <Text
          color="dimmed"
          className={classes.description}
          align="center"
          mt="sm"
        >
          Connect Enrolla to other platforms such as authentication, CRM, and
          databases to support importing existing customers or automatically
          keeping other systems in sync. Connect to a platform by selecting it
          from the list and following the prompts.
        </Text>
        <SimpleGrid mt={50} cols={4}>
          {cards}
        </SimpleGrid>
      </Card>
    </Authenticated>
  );
};
