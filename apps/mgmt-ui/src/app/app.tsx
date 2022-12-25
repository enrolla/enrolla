import { Refine } from '@pankod/refine-core';
import routerProvider from '@pankod/refine-react-router-v6';
import dataProvider from '@pankod/refine-simple-rest';
import {
  MantineProvider,
  Global,
  NotificationsProvider,
  notificationProvider,
  LightTheme,
  Layout,
  ReadyPage,
  ErrorComponent,
} from '@pankod/refine-mantine';

export default function App() {
  return (
    <MantineProvider theme={LightTheme} withNormalizeCSS withGlobalStyles>
      <Global styles={{ body: { WebkitFontSmoothing: 'auto' } }} />
      <NotificationsProvider position="top-right">
        <Refine
          routerProvider={routerProvider}
          dataProvider={dataProvider('https://api.fake-rest.refine.dev')}
          notificationProvider={notificationProvider}
          ReadyPage={ReadyPage}
          catchAll={<ErrorComponent />}
          Layout={Layout}
        />
      </NotificationsProvider>
    </MantineProvider>
  );
}
