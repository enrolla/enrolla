import { useNavigation } from '@pankod/refine-core';
import {
  Card,
  Text,
  Group,
  Stack,
  Title,
  Center,
  createStyles,
  Progress,
  Box,
  ThemeIcon,
  useMantineTheme,
} from '@pankod/refine-mantine';
import { IconCheck } from '@tabler/icons';
import { useEffect } from 'react';
import {
  onboardingSteps,
  StepProps,
  useOnboarding,
  useOnboardingPercentage,
} from '../utils/onboarding';

const useStyles = createStyles((theme) => ({
  card: {
    transition: 'transform 150ms ease, box-shadow 150ms ease',

    '&:hover': {
      boxShadow: theme.shadows.sm,
      cursor: 'pointer',
    },
  },
}));

export const OnboardingStep = ({
  text,
  subText,
  icon,
  time,
  link,
}: StepProps) => {
  const { push } = useNavigation();
  const theme = useMantineTheme();
  const { classes } = useStyles();

  const [onboardingStatus, setOnboardingStatus] = useOnboarding();
  const onboardingPercentage = useOnboardingPercentage();
  const complete = onboardingStatus.stepsDone.includes(text);

  useEffect(() => {
    if (onboardingPercentage === 100) {
      push('/');
    }
  });

  return (
    <Card
      className={classes.card}
      withBorder
      radius="md"
      onClick={() => {
        setOnboardingStatus({
          minutes: onboardingStatus.minutes + time,
          stepsDone: [...onboardingStatus.stepsDone, text],
        });
        push(link);
      }}
    >
      <Group position="apart" mb="xs">
        <Group>
          <Box>
            {icon({
              size: 32,
              color: theme.colorScheme === 'dark' ? '#DAE2EC' : '#6644EC',
            })}
            {complete && (
              <ThemeIcon
                color={theme.colorScheme === 'dark' ? 'black' : 'white'}
                size={23}
                radius={20}
                ml={-18}
              >
                <ThemeIcon
                  color={theme.colorScheme === 'dark' ? '#987DFF' : '#6644EC'}
                  size={20}
                  radius={20}
                >
                  <IconCheck
                    color={theme.colorScheme === 'dark' ? 'black' : 'white'}
                    size={14}
                  />
                </ThemeIcon>
              </ThemeIcon>
            )}
          </Box>
          <Stack spacing={0}>
            <Title order={4}>{text}</Title>
            <Text>{subText}</Text>
          </Stack>
        </Group>
        {!complete && <Text>about {time} min</Text>}
        {complete && (
          <Text color={theme.colorScheme === 'dark' ? '#987DFF' : '#6644EC'}>
            Complete!
          </Text>
        )}
      </Group>
      <Card.Section>
        <Progress
          sections={[{ value: 100, color: complete ? '#C4B6FC' : 'white' }]}
        />
      </Card.Section>
    </Card>
  );
};

export const Onboarding = () => {
  return (
    <Center>
      <Stack w="90%">
        <Title mt="xl">Getting Started</Title>
        <Text>
          Welcome! click on the items below to start working with Enrolla.
        </Text>
        <Stack>
          {onboardingSteps.map((step) => (
            <OnboardingStep {...step} />
          ))}
        </Stack>
      </Stack>
    </Center>
  );
};
