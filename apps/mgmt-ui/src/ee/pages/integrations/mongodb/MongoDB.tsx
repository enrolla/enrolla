import { Authenticated } from '@pankod/refine-core';
import {
  Accordion,
  Avatar,
  Card,
  Text,
  ThemeIcon,
  Timeline,
  Title,
  createStyles,
  useMantineTheme,
} from '@pankod/refine-mantine';
import {
  IconCameraSelfie,
  IconDatabaseImport,
  IconLayoutList,
  IconPhoto,
  IconPlug,
  IconPrinter,
  IconSun,
  IconUsers,
  IconVideo,
} from '@tabler/icons';

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

export const MongoDB = () => {
  const { classes } = useStyles();
  const theme = useMantineTheme();
  const getColor = (color: string) =>
    theme.colors[color][theme.colorScheme === 'dark' ? 5 : 7];

  return (
    <Authenticated>
      <Card>
        <Title order={2} className={classes.title} align="center" mt={80}>
          Set up MongoDB Integration
        </Title>
        <Text
          color="dimmed"
          className={classes.description}
          align="center"
          mt="sm"
        >
          By setting up MongoDB integration, you will be able to import your
          customers and their features.
        </Text>
        <Timeline active={2}>
          {/* If you do not pass bullet prop, default bullet will be rendered */}
          <Timeline.Item
            title="Connect a MongoDB database"
            bulletSize={24}
            bullet={<IconPlug size={18} color="white" />}
          >
            <Text color="dimmed" size="sm">
              Default bullet without anything
            </Text>
          </Timeline.Item>

          {/* You can use any react node as bullet, e.g. Avatar, ThemeIcon or any svg icon */}
          <Timeline.Item
            title="Select customers"
            bulletSize={24}
            bullet={<IconUsers size={18} color="white" />}
          >
            <Text color="dimmed" size="sm">
              Timeline bullet as avatar image
            </Text>
          </Timeline.Item>

          <Timeline.Item
            title="Select and map features"
            bulletSize={22}
            bullet={<IconLayoutList size={18} color="white" />}
          >
            <Text color="dimmed" size="sm">
              Timeline bullet as icon
            </Text>
          </Timeline.Item>

          <Timeline.Item
            title="Import customers and their features"
            bulletSize={24}
            bullet={<IconDatabaseImport size={18} color="white" />}
          >
            <Text color="dimmed" size="sm">
              Timeline bullet as ThemeIcon component
            </Text>
          </Timeline.Item>
        </Timeline>
      </Card>
    </Authenticated>
  );
};
