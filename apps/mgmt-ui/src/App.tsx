import { AuthProvider, Refine } from '@pankod/refine-core';
import routerProvider from '@pankod/refine-react-router-v6';
import {
  MantineProvider,
  Global,
  NotificationsProvider,
  notificationProvider,
  ReadyPage,
  ErrorComponent,
  Image,
  useLocalStorage,
  ColorScheme,
  ColorSchemeProvider,
} from '@pankod/refine-mantine';
import logo from './assets/logo.png';
import logoDark from './assets/logo_dark.png';
import { useAuthInfo, useLogoutFunction } from '@propelauth/react';
import { Login } from './pages/login';
import { FeatureCreate, FeatureList, FeatureShow } from './pages/features';
import { PackageCreate, PackageList, PackageShow } from './pages/packages';
import {
  IconPackage,
  IconLayoutList,
  IconUsers,
  IconBuildingStore,
} from '@tabler/icons';
import { Layout } from './components/layout';
import dataProvider from './providers/backendGraphQLProvider';
import { GraphQLClient } from 'graphql-request';
import { CustomerCreate, CustomerList, CustomerShow } from './pages/customers';
import { Integrations } from './pages/integrations';
import { Dashboard } from './pages/dashboard';
import { useEffect, useMemo } from 'react';

export default function App() {
  const authInfo = useAuthInfo();
  const logoutFn = useLogoutFunction();

  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'mantine-color-scheme',
    defaultValue: 'light',
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  const gqlClient = useMemo(
    () => new GraphQLClient(`${import.meta.env.VITE_BACKEND_URL}/graphql`),
    []
  );

  useEffect(() => {
    if (!authInfo.loading && authInfo.isLoggedIn) {
      gqlClient.setHeader('Authorization', `Bearer ${authInfo.accessToken}`);
    }
  }, [authInfo, gqlClient]);

  if (authInfo.loading) {
    return <span>loading...</span>;
  }

  const authProvider: AuthProvider = {
    login: () => {
      return Promise.resolve();
    },
    logout: () => {
      logoutFn(true);
      return Promise.resolve('/');
    },
    checkError: () => Promise.resolve(),
    checkAuth: () => {
      if (authInfo.isLoggedIn) {
        return Promise.resolve();
      }

      return Promise.reject();
    },
    getPermissions: () => Promise.resolve(),
    getUserIdentity: async () => {
      if (authInfo.user) {
        return {
          ...authInfo.user,
          avatar: authInfo.user.pictureUrl,
        };
      }
    },
  };

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{
          colorScheme,
          fontFamily: 'Nunito',
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
            routerProvider={{
              ...routerProvider,
              routes: [
                {
                  element: <Integrations />,
                  path: 'integrations',
                  layout: true,
                },
              ],
            }}
            authProvider={authProvider}
            dataProvider={dataProvider(gqlClient)}
            notificationProvider={notificationProvider}
            DashboardPage={Dashboard}
            ReadyPage={ReadyPage}
            LoginPage={Login}
            catchAll={<ErrorComponent />}
            Layout={Layout}
            Title={() => (
              <Image
                mt={20}
                mb={10}
                height={40}
                fit="contain"
                src={colorScheme === 'dark' ? logoDark : logo}
              />
            )}
            resources={[
              {
                name: 'customers',
                list: CustomerList,
                show: CustomerShow,
                create: CustomerCreate,
                icon: <IconUsers size="16" />,
              },
              {
                name: 'features',
                list: FeatureList,
                show: FeatureShow,
                create: FeatureCreate,
                canDelete: true,
                icon: <IconLayoutList size="16" />,
              },
              {
                name: 'packages',
                list: PackageList,
                show: PackageShow,
                create: PackageCreate,
                icon: <IconPackage size="16" />,
              },
              {
                name: 'integrations',
                list: () => null,
                icon: <IconBuildingStore size="16" />,
              },
            ]}
          />
        </NotificationsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
