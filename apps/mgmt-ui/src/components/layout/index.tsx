import React, { useEffect } from 'react';
import { Box, useLocalStorage } from '@pankod/refine-mantine';
import type { RefineLayoutLayoutProps } from '@pankod/refine-mantine';
import { Sider } from './sider';
import { useNavigation } from '@pankod/refine-core';

export const Layout: React.FC<RefineLayoutLayoutProps> = ({
  Footer,
  OffLayoutArea,
  children,
}) => {
  const [firstSignup, setFirstSignup] = useLocalStorage<boolean>({
    key: 'firstSignup',
    defaultValue: true,
  });

  const { replace } = useNavigation();
  useEffect(() => {
    if (firstSignup) {
      setFirstSignup(false);
      replace('/onboarding');
    }
  }, [firstSignup, replace, setFirstSignup]);

  return (
    <Box sx={{ display: 'flex' }}>
      <Sider />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          overflow: 'auto',
        }}
      >
        <Box
          component="main"
          sx={(theme) => ({
            padding: theme.spacing.sm,
            backgroundColor:
              theme.colorScheme === 'dark' ? theme.colors.dark[8] : '#F7F8FD',
            minHeight: '100vh',
          })}
        >
          {children}
        </Box>
        {Footer && <Footer />}
      </Box>
      {OffLayoutArea && <OffLayoutArea />}
    </Box>
  );
};
