import * as sdk from '@enrolla/node-server-sdk';

export const testNodeServerSdk = async () => {
  try {
    await sdk.initialize({
      url: 'http://localhost:3000/graphql',
      privateKey: 'ZnwGI9ObidfIUj3bPhBzdSDM9NoyVfzPRfUCnPHsbIM=',
      apiToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRJZCI6IjgxZjZjNzljLTg4ZjQtNDI5YS1iY2VlLWY1NmFjNTE5NGJiYSIsImlhdCI6MTY3NDEzNTU0NX0.Lxyny0O9oX_cCRGLWpTQyDtHTwb1hdM7tydsGVyhIX8',
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

  // console.log('Initiated Successfully');
  // console.log('value before ', sdk.getSecretValue('tt', 'a'));

  // await sdk.updateCustomerSecrets('a', {key: 'tt', value: '12366666'});
  // console.log('value after ', sdk.getSecretValue('tt', 'a'));

  await sdk.updateCustomerFeatures('105ce4c9-7674-4482-91a5-7fa2f2453a94', {
    key: 'ry',
    value: 'lalalalal',
  });
};
