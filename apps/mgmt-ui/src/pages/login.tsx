import { Button } from '@pankod/refine-mantine';
import { useRedirectFunctions } from '@propelauth/react';

export const Login: React.FC = () => {
  const { redirectToCreateOrgPage } = useRedirectFunctions();

  return (
    <div style={{ height: '100vh', display: 'flex' }}>
      <div style={{ maxWidth: '200px', margin: 'auto' }}>
        <Button onClick={() => redirectToCreateOrgPage()}>Sign in</Button>
      </div>
    </div>
  );
};
