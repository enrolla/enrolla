/* eslint-disable no-console */
import * as sdk from '@enrolla/node-server-sdk';
import { env } from 'process';

export const testNodeServerSdk = async () => {
  try {
    await sdk.initialize({
      url: env.SDK_ENROLLA_SERVER_GRAPHQL_ENDPOINT,
      apiToken: env.SDK_API_TOKEN,
      privateKey: env.SDK_ENROLLA_PRIVATE_ENCRYPTION_KEY,
      evaluationHooks: {
        beforeEvaluation: (feature, organizationId) =>
          console.log('beforeEvaluation', feature, organizationId),
        afterEvaluation: (feature, organizationId, res) =>
          console.log('afterEvaluation', feature, organizationId, res),
      },
      polling: {
        enabled: true,
        intervalSeconds: 10,
        onError: (error) => console.log('onPollingError', error),
      },
    });
  } catch (err) {
    console.log('Initiation Failed');
    console.log(err);
    throw err;
  }

  console.log('Initiated Successfully');

  const orgId = 'local_test_app_org_id;';
  const secretKey = 'local_test_app_secret';

  console.log(
    'Secret value before change',
    sdk.getSecretValue(secretKey, orgId)
  );

  const newValue = 'new_value';
  await sdk.updateCustomerSecrets(orgId, { key: secretKey, value: newValue });

  console.log(
    'Secret value after change ',
    sdk.getSecretValue(secretKey, orgId)
  );
};
