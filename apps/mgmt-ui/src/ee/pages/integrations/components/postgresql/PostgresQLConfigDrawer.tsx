import { Button, Group, Stepper, Text } from '@pankod/refine-mantine';
import {
  IconDatabaseImport,
  IconLayoutList,
  IconPlug,
  IconUsers,
} from '@tabler/icons';
import { useState } from 'react';
import {
  IntegrationSetupDrawer,
  IntegrationSetupDrawerProps,
} from '../IntegrationSetupDrawer';

export const PostgresQLConfigDrawer = (props: IntegrationSetupDrawerProps) => {
  const [active, setActive] = useState(0);
  const nextStep = () =>
    setActive((current) => (current < 4 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  return (
    <IntegrationSetupDrawer
      heading="Set up PostgresQL Integration"
      description="By setting up PostgresQL integration, you will be able to import your
          customers and their features."
      {...props}
    >
      <Stepper
        orientation="vertical"
        size="md"
        iconSize={32}
        active={active}
        onStepClick={setActive}
        mt={40}
      >
        <Stepper.Step
          label="Connect a PostgreQL database"
          icon={<IconPlug size={18} />}
        >
          <Text color="dimmed" size="sm">
            Default bullet without anything
          </Text>
        </Stepper.Step>

        <Stepper.Step label="Select customers" icon={<IconUsers size={18} />}>
          <Text color="dimmed" size="sm">
            Timeline bullet as avatar image
          </Text>
        </Stepper.Step>

        <Stepper.Step
          label="Select and map features"
          icon={<IconLayoutList size={18} />}
        >
          <Text color="dimmed" size="sm">
            Timeline bullet as icon
          </Text>
        </Stepper.Step>

        <Stepper.Step
          label="Import customers and their features"
          icon={<IconDatabaseImport size={18} />}
        >
          <Text color="dimmed" size="sm">
            Timeline bullet as ThemeIcon component
          </Text>
        </Stepper.Step>
      </Stepper>

      <Group position="right" mt="xl">
        <Button variant="default" onClick={prevStep}>
          Back
        </Button>
        <Button onClick={nextStep}>{active < 3 ? 'Next' : 'Finish'}</Button>
      </Group>
    </IntegrationSetupDrawer>
  );
};
