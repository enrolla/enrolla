import { Button } from '@pankod/refine-mantine';
import { useRedirectFunctions } from '@propelauth/react';

export const Login: React.FC = () => {
  const { redirectToLoginPage } = useRedirectFunctions();

  return (
    <div style={{ height: '100vh', display: 'flex' }}>
      <div style={{ maxWidth: '200px', margin: 'auto' }}>
        <Button onClick={() => redirectToLoginPage()}>Sign in</Button>
      </div>
    </div>
  );
};
