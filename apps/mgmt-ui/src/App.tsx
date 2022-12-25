import { AuthProvider, Refine } from '@pankod/refine-core';
import routerProvider from '@pankod/refine-react-router-v6';
import dataProvider from '@pankod/refine-simple-rest';
import {
  MantineProvider,
  Global,
  NotificationsProvider,
  notificationProvider,
  Layout,
  ReadyPage,
  ErrorComponent,
} from '@pankod/refine-mantine';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { Login } from './pages/login';
import { FeatureCreate, FeatureList, FeatureShow } from './pages/features';

export default function App() {
  const { isLoading, isAuthenticated, user, logout, getIdTokenClaims } =
    useAuth0();

  if (isLoading) {
    return <span>loading...</span>;
  }

  const authProvider: AuthProvider = {
    login: () => {
      return Promise.resolve();
    },
    logout: () => {
      logout({ returnTo: window.location.origin });
      return Promise.resolve('/');
    },
    checkError: () => Promise.resolve(),
    checkAuth: () => {
      if (isAuthenticated) {
        return Promise.resolve();
      }

      return Promise.reject();
    },
    getPermissions: () => Promise.resolve(),
    getUserIdentity: async () => {
      if (user) {
        return {
          ...user,
          avatar: user.picture,
        };
      }
    },
  };

  getIdTokenClaims().then((token) => {
    if (token) {
      axios.defaults.headers.common = {
        Authorization: `Bearer ${token.__raw}`,
      };
    }
  });

  return (
    <MantineProvider
      theme={{
        colorScheme: 'light',
        fontFamily: 'Inter',
        black: '#626262',
        components: {
          Table: {
            styles: (theme) =>
              theme.colorScheme === 'light'
                ? {
                    root: {
                      'thead>tr>th': {
                        backgroundColor: '#fafafa',
                        padding: '16px 4px',
                      },
                      'thead>tr>th:first-of-type': {
                        borderTopLeftRadius: theme.defaultRadius,
                      },
                      'thead>tr>th:last-of-type': {
                        borderTopRightRadius: theme.defaultRadius,
                      },
                      'tbody>tr>td': {
                        borderBottom: '1px solid #f0f0f0',
                      },
                    },
                  }
                : { root: {} },
          },
        },
      }}
      withNormalizeCSS
      withGlobalStyles
    >
      <Global styles={{ body: { WebkitFontSmoothing: 'auto' } }} />
      <NotificationsProvider position="bottom-right">
        <Refine
          routerProvider={routerProvider}
          authProvider={authProvider}
          dataProvider={dataProvider(
            `${import.meta.env.VITE_BACKEND_URL}/v1/management`,
            axios
          )}
          notificationProvider={notificationProvider}
          ReadyPage={ReadyPage}
          LoginPage={Login}
          catchAll={<ErrorComponent />}
          Layout={Layout}
          Title={() => <div style={{ width: '20px', height: '80px' }} />}
          resources={[
            {
              name: 'features',
              list: FeatureList,
              show: FeatureShow,

              create: FeatureCreate,
              canDelete: true,
            },
          ]}
        />
      </NotificationsProvider>
    </MantineProvider>
  );
}
