import { env } from 'process';
import { ConfigurationManager } from '../../configuration-manager.interface';
import * as sdk from '@enrolla/node-server-sdk';
import { Injectable, Logger } from '@nestjs/common';
import { EnrollaError } from '@enrolla/node-server-sdk';

@Injectable()
export class SdkConfigurationManager implements ConfigurationManager {
  private static readonly logger = new Logger(SdkConfigurationManager.name);

  private static readonly pollingEnabled = env.SDK_POLLING_ENABLED
    ? env.SDK_POLLING_ENABLED === true.toString()
    : true;
  private static readonly DEFAULT_POLLING_INTERVAL_SECONDS = 60;
  private static readonly pollingIntervalSeconds =
    Number(env.SDK_POLLING_INTERVAL_SECONDS) ||
    SdkConfigurationManager.DEFAULT_POLLING_INTERVAL_SECONDS;

  static async initialize() {
    sdk
      .initialize({
        url: env.SDK_ENROLLA_SERVER_GRAPHQL_ENDPOINT,
        apiToken: env.SDK_API_TOKEN,
        privateKey: env.SDK_ENROLLA_PRIVATE_ENCRYPTION_KEY,
        polling: {
          enabled: this.pollingEnabled,
          intervalSeconds: this.pollingIntervalSeconds,
          onError: (error) =>
            this.logger.error('onPollingError', error.cause?.stack),
        },
        pushUpdates: {
          enabled: true,
          onError: (error) =>
            this.logger.error('onPushError', error.cause?.stack),
        },
      })
      .then(() => {
        this.logger.log('SDK Initialized Successfully');
      })
      .catch((err: EnrollaError) => {
        this.logger.error('SDK Initiation Failed', err.cause?.stack);
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
