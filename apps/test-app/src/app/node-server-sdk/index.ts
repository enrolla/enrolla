/* eslint-disable no-console */
import * as sdk from '@enrolla/node-server-sdk';
import { env } from 'process';

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

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
      pushUpdates: {
        enabled: true,
        onError: (error) => console.log(error),
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

  const orgId = '201dd371-ffbc-4905-a01c-78c228ef7934';
  const key = 'maxEventsPerSec';

  console.log('feat value before change', sdk.getFeatureValue(key, orgId));

  // await sdk.updateCustomerFeatures(orgId, { key, value: 1000 });

  await delay(20000);

  console.log('feat value after change', sdk.getFeatureValue(key, orgId));
};
