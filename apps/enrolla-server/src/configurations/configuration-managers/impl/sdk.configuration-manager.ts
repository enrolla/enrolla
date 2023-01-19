import { env } from 'process';
import { ConfigurationManager } from '../../configuration-manager.interface';
import * as sdk from '@enrolla/node-server-sdk';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SdkConfigurationManager implements ConfigurationManager {
  private readonly logger = new Logger(SdkConfigurationManager.name);

  DEFAULT_POLLING_INTERVAL_SECONDS = 10;
  private url = env.SDK_ENROLLA_SERVER_GRAPHQL_ENDPOINT;
  private apiToken = env.SDK_API_TOKEN;
  private privateKey = env.SDK_ENROLLA_PRIVATE_ENCRYPTION_KEY;
  private pollingEnabled = env.SDK_POLLING_ENABLED
    ? env.SDK_POLLING_ENABLED === 'true'
    : true;
  private pollingIntervalSeconds = env.SDK_POLLING_INTERVAL_SECONDS
    ? parseInt(env.SDK_POLLING_INTERVAL_SECONDS)
    : this.DEFAULT_POLLING_INTERVAL_SECONDS;

  constructor() {
    sdk
      .initialize({
        url: this.url,
        apiToken: this.apiToken,
        privateKey: this.privateKey,
        polling: {
          enabled: this.pollingEnabled,
          intervalSeconds: 10,
          onError: (error) => this.logger.error('onPollingError', error),
        },
      })
      .catch((err) => {
        this.logger.error('SDK Initiation Failed', err);
        throw err;
      });
  }

  getValue<T>(tenantId: string, key: string) {
    return sdk.getFeatureValue(key, tenantId) as T;
  }

  getSecretValue(tenantId: string, key: string) {
    return sdk.getSecretValue(key, tenantId);
  }
}
