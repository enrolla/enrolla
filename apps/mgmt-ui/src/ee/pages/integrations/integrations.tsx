import { Authenticated, useCustom } from '@pankod/refine-core';
import {
  Card,
  createStyles,
  SimpleGrid,
  Image,
  Badge,
  Group,
  Title,
  Text,
  ThemeIcon,
  Box,
} from '@pankod/refine-mantine';
import postgres from '../../../assets/integrations/postgres.svg';
import mysql from '../../../assets/integrations/mysql.svg';
import mongodb from '../../../assets/integrations/mongodb.svg';
import auth0 from '../../../assets/integrations/auth0.svg';
import propelauth from '../../../assets/integrations/propelauth.svg';
import workos from '../../../assets/integrations/workos.svg';
import firebase from '../../../assets/integrations/firebase.svg';
import salesforce from '../../../assets/integrations/salesforce.svg';
import hubspot from '../../../assets/integrations/hubspot.svg';
import { useState } from 'react';
import { IconCheck } from '@tabler/icons';
import { Integration } from '@enrolla/graphql-codegen';
import { MongoDBConfigDrawer } from './components/database/mongodb/MongoDBConfigDrawer';
import { Auth0ConfigDrawer } from './components/auth/Auth0ConfigDrawer';
import { PropelAuthConfigDrawer } from './components/auth/PropelAuthConfigDrawer';
import { PostgresQLConfigDrawer } from './components/database/postgresql/PostgresQLConfigDrawer';

enum IntegrationType {
  CRM = 'CRM',
  Database = 'Database',
  Authentication = 'Authentication',
}

type UiIntegration = {
  name: string;
  title: string;
  image: string;
  type: IntegrationType;
};

const uiIntegrations: UiIntegration[] = [
  {
    name: 'auth0',
    title: 'Auth0',
    image: auth0,
    type: IntegrationType.Authentication,
  },
  {
    name: 'propelauth',
    title: 'PropelAuth',
    image: propelauth,
    type: IntegrationType.Authentication,
  },
  {
    name: 'mongodb',
    title: 'MongoDB',
    image: mongodb,
    type: IntegrationType.Database,
  },
  {
    name: 'postgresql',
    title: 'PostgresQL',
    image: postgres,
    type: IntegrationType.Database,
  },
  {
    name: 'mysql',
    title: 'MySQL',
    image: mysql,
    type: IntegrationType.Database,
  },
  {
    name: 'workos',
    title: 'WorkOS',
    image: workos,
    type: IntegrationType.Authentication,
  },
  {
    name: 'firebase',
    title: 'Firebase',
    image: firebase,
    type: IntegrationType.Authentication,
  },
  {
    name: 'salesforce',
    title: 'Salesforce',
    image: salesforce,
    type: IntegrationType.CRM,
  },
  {
    name: 'hubspot',
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

  const [drawerOpened, setDrawerOpened] = useState('');

  const { data, isLoading } = useCustom<Integration[]>({
    url: '', // required param, but not used. See backendGraphQLProvider.ts custom method
    method: 'get',
    metaData: {
      operation: 'integrations',
      fields: ['name', 'isConfigured'],
    },
  });

  const colors: { [key in IntegrationType]: string } = {
    Authentication: 'violet',
    Database: 'green',
    CRM: 'blue',
  };

  const cards = uiIntegrations.map((integration: UiIntegration) => {
    if (isLoading || !data) {
      return null;
    }
    const serverIntegration = data.data.find(
      (i) => i.name === integration.name
    );

    if (serverIntegration?.isAvailable) {
      return null;
    }

    return (
      <Card
        withBorder
        radius="md"
        className={classes.card}
        onClick={() => setDrawerOpened(integration.title)}
      >
        <Group position="right">
          {serverIntegration && serverIntegration.isConfigured ? (
            <ThemeIcon color="green" size={20} radius="lg">
              <IconCheck size="16" />
            </ThemeIcon>
          ) : (
            <Box sx={{ height: 20 }} />
          )}
        </Group>
        <Image src={integration.image} height={40} fit="contain" />
        <Group position="apart" mt="lg">
          <Title order={6} weight={500}>
            {integration.title}
          </Title>
          {!serverIntegration && <Badge color="gray">Coming Soon</Badge>}
          {serverIntegration && (
            <Badge color={colors[integration.type]}>{integration.type}</Badge>
          )}
        </Group>
      </Card>
    );
  });

  return (
    <Authenticated>
      <Auth0ConfigDrawer
        opened={drawerOpened === 'Auth0'}
        onClose={() => setDrawerOpened('')}
      />
      <PropelAuthConfigDrawer
        opened={drawerOpened === 'PropelAuth'}
        onClose={() => setDrawerOpened('')}
      />
      <MongoDBConfigDrawer
        opened={drawerOpened === 'MongoDB'}
        onClose={() => setDrawerOpened('')}
      />
      <PostgresQLConfigDrawer
        opened={drawerOpened === 'PostgresQL'}
        onClose={() => setDrawerOpened('')}
      />
      <Card>
        <Title order={2} className={classes.title} align="center" mt={80}>
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
        <SimpleGrid mt={80} cols={4}>
          {!isLoading && cards}
        </SimpleGrid>
      </Card>
    </Authenticated>
  );
};
