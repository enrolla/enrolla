import { Refine } from '@pankod/refine-core';
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
import { Login } from './pages/login';
import { ApiTokenList } from './pages/api-tokens';
import { EncryptionKeyList } from './pages/encryption-keys';
import { FeatureCreate, FeatureList, FeatureShow } from './pages/features';
import {
  PackageCreate,
  PackageEdit,
  PackageList,
  PackageShow,
} from './pages/packages';
import {
  IconPackage,
  IconLayoutList,
  IconUsers,
  IconShieldLock,
  IconSettings,
  IconKey,
  IconBolt,
} from '@tabler/icons';
import { Layout } from './components/layout';
import dataProvider from './providers/backendGraphQLProvider';
import {
  CustomerCreate,
  CustomerEdit,
  CustomerList,
  CustomerShow,
} from './pages/customers';
import { Integrations } from './ee/pages/integrations';
import useAuthProvider from './providers/useAuthProvider';
import { SecretKeyList } from './pages/secret-keys';

export default function App() {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'mantine-color-scheme',
    defaultValue: 'light',
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  const { loaded, authProvider, gqlClient } = useAuthProvider();

  if (!loaded) {
    return <span>loading...</span>;
  }

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
                edit: CustomerEdit,
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
                edit: PackageEdit,
                icon: <IconPackage size="16" />,
              },
              {
                name: 'secret-keys',
                key: 'secretKeys',
                list: SecretKeyList,
                options: { label: 'Secrets' },
                icon: <IconKey size="16" />,
              },
              {
                name: 'integrations',
                list: () => null,
                icon: <IconBolt size="16" />,
              },
              { name: 'settings', icon: <IconSettings size="16" /> },
              {
                name: 'api-tokens',
                key: 'apiTokens',
                parentName: 'settings',
                list: ApiTokenList,
                canDelete: true,
                options: { label: 'API Tokens' },
                icon: <IconShieldLock size="16" />,
              },
              {
                name: 'encryption-keys',
                key: 'encryptionKeys',
                parentName: 'settings',
                list: EncryptionKeyList,
                canDelete: true,
                options: { label: 'Encryption Key' },
                icon: <IconKey size="16" />,
              },
            ]}
          />
        </NotificationsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
