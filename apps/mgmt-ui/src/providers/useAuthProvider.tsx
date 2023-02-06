import { AuthProvider } from '@pankod/refine-core';
import {
  useAuthInfo,
  useRedirectFunctions,
  useLogoutFunction,
} from '@propelauth/react';
import { GraphQLClient } from 'graphql-request';
import { useEffect, useMemo, useState } from 'react';

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
      redirectToCreateOrgPage();
      return;
    }

    setLoaded(true);

    if (authInfo.isLoggedIn) {
      gqlClient.setHeader('Authorization', `Bearer ${authInfo.accessToken}`);
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
