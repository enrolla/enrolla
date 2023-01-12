import { useRedirectFunctions } from '@propelauth/react';
import { useEffect } from 'react';

export const Login: React.FC = () => {
  const { redirectToLoginPage } = useRedirectFunctions();

  useEffect(() => redirectToLoginPage());

  return <></>;
};
