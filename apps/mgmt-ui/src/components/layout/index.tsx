import React from 'react';
import { Box } from '@pankod/refine-mantine';
import type { RefineLayoutLayoutProps } from '@pankod/refine-mantine';
import { Sider } from './sider';

export const Layout: React.FC<RefineLayoutLayoutProps> = ({
  Footer,
  OffLayoutArea,
  children,
}) => {
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
