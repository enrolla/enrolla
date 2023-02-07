import { AuthProvider } from '@pankod/refine-core';
import {
  useAuthInfo,
  useRedirectFunctions,
  useLogoutFunction,
} from '@propelauth/react';
import { GraphQLClient } from 'graphql-request';
import { useEffect, useMemo, useState } from 'react';
import posthog from 'posthog-js';

/* eslint-disable react-hooks/rules-of-hooks */
export default function useAuthProvider():
  | { loaded: false; authProvider: undefined; gqlClient: undefined }
  | { loaded: true; authProvider?: AuthProvider; gqlClient: GraphQLClient } {
  if (!import.meta.env.VITE_PROPELAUTH_URL) {
    return {
      loaded: true,
      authProvider: undefined,
      gqlClient: new GraphQLClient(
        `${import.meta.env.VITE_BACKEND_URL}/graphql`
      ),
    };
  }

  const authInfo = useAuthInfo();
  const { redirectToCreateOrgPage } = useRedirectFunctions();
  const logoutFn = useLogoutFunction();

  const gqlClient = useMemo(
    () => new GraphQLClient(`${import.meta.env.VITE_BACKEND_URL}/graphql`),
    []
  );

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (authInfo.loading) {
      return;
    }

    if (authInfo.orgHelper?.getOrgs().length === 0) {
      if (import.meta.env.VITE_POSTHOG_TOKEN) {
        posthog.capture('registration', { email: authInfo.user?.username });
      }
      redirectToCreateOrgPage();
      return;
    }

    setLoaded(true);

    if (authInfo.isLoggedIn) {
      gqlClient.setHeader('Authorization', `Bearer ${authInfo.accessToken}`);

      if (
        import.meta.env.VITE_POSTHOG_TOKEN &&
        import.meta.env.VITE_POSTHOG_TOKEN !== 'disabled'
      ) {
        posthog.identify(authInfo.user?.userId, {
          email: authInfo.user?.email,
          org: authInfo.orgHelper?.getOrgs()[0].orgName,
        });
      }
    }
  }, [authInfo, redirectToCreateOrgPage, gqlClient]);

  if (!loaded) {
    return { loaded: false, authProvider: undefined, gqlClient: undefined };
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
      if (!authInfo.loading && authInfo.isLoggedIn) {
        return Promise.resolve();
      }

      return Promise.reject();
    },
    getPermissions: () => Promise.resolve(),
    getUserIdentity: async () => {
      if (!authInfo.loading && authInfo.user) {
        return {
          ...authInfo.user,
          avatar: authInfo.user.pictureUrl,
        };
      }
    },
  };

  return { loaded, authProvider, gqlClient };
}
