import { Authenticated } from '@pankod/refine-core';
import {
  Drawer,
  DrawerProps,
  ScrollArea,
  Text,
  Title,
  createStyles,
} from '@pankod/refine-mantine';

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

export interface IntegrationSetupDrawerProps extends DrawerProps {
  heading?: string;
  description?: string;
}

export const IntegrationSetupDrawer = (props: IntegrationSetupDrawerProps) => {
  const { classes } = useStyles();

  return (
    <Authenticated>
      <Drawer
        {...props}
        position="right"
        padding="xl"
        size="xl"
        lockScroll={false}
      >
        <Title order={2} className={classes.title} align="center" mt={20}>
          {props.heading}
        </Title>
        <Text
          color="dimmed"
          className={classes.description}
          align="center"
          mt="sm"
        >
          {props.description}
        </Text>
        <ScrollArea style={{ height: 500 }} mt={40}>
          {props.children}
        </ScrollArea>
      </Drawer>
    </Authenticated>
  );
};
