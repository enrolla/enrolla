import * as sdk from '@enrolla/node-server-sdk';

export const testNodeServerSdk = async () => {
  try {
    await sdk.initialize({
      url: 'https://api-staging.vecinity.io/graphql',
      apiToken: 'xxx',
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

  console.log(
    `getFeatureValue('customBranding', 'org_uNs3xw0NQTwUaQO6') - ${sdk.getFeatureValue(
      'customBranding',
      'org_uNs3xw0NQTwUaQO6'
    )}`
  );
  console.log(
    `getFeatureBooleanValue('customBranding', 'org_uNs3xw0NQTwUaQO6') - ${sdk.getFeatureBooleanValue(
      'customBranding',
      'org_uNs3xw0NQTwUaQO6'
    )}`
  );
  console.log(
    `getFeatureIntegerValue('maxEventsPerSec', 'org_uNs3xw0NQTwUaQO6') - ${sdk.getFeatureIntegerValue(
      'maxEventsPerSec',
      'org_uNs3xw0NQTwUaQO6'
    )}`
  );
};
