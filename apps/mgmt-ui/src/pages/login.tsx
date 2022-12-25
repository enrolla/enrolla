import { Button } from '@pankod/refine-mantine';
import { useAuth0 } from '@auth0/auth0-react';

export const Login: React.FC = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <div style={{ height: '100vh', display: 'flex' }}>
      <div style={{ maxWidth: '200px', margin: 'auto' }}>
        <Button onClick={() => loginWithRedirect()}>Sign in</Button>
      </div>
    </div>
  );
};
