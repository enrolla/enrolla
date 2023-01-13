import { ConfigurationManager } from '../configuration-manager.interface';
import * as sdk from '@enrolla/node-server-sdk';

export class SdkConfigurationManager implements ConfigurationManager {
  private sdkInitialized = false;

  async initialize() {
    if (this.sdkInitialized) {
      return;
    }

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

      this.sdkInitialized = true;
    } catch (err) {
      console.log('SDK Initiation Failed');
      console.log(err);
      throw err;
    }
  }
  async getValue<T>(tenantId: string, key: string): Promise<T | null> {
    await this.initialize();

    return (await sdk.getFeatureValue(key, tenantId)) as T;
  }
}
