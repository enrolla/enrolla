import * as sdk from '@enrolla/node-server-sdk';

export const testNodeServerSdk = async () => {
  try {
    await sdk.initialize({
      url: 'http://localhost:3000/graphql',
      privateKey: '9lieJsqLPcxcgHOnsFP+WPDlZ1JlsdF97WQrkrBFcb4=',
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
  console.log('k1', sdk.getSecretValue('k1', '123'));
  console.log('kk', sdk.getSecretValue('kk', '123'));
};
