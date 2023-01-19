import { env } from 'process';
import { ConfigurationManager } from '../../configuration-manager.interface';
import * as sdk from '@enrolla/node-server-sdk';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SdkConfigurationManager implements ConfigurationManager {
  private readonly logger = new Logger(SdkConfigurationManager.name);

  private readonly pollingEnabled = env.SDK_POLLING_ENABLED
    ? env.SDK_POLLING_ENABLED === true.toString()
    : true;
  private readonly DEFAULT_POLLING_INTERVAL_SECONDS = 60;
  private pollingIntervalSeconds =
    Number(env.SDK_POLLING_INTERVAL_SECONDS) ??
    this.DEFAULT_POLLING_INTERVAL_SECONDS;

  async initialize() {
    sdk
      .initialize({
        url: env.SDK_ENROLLA_SERVER_GRAPHQL_ENDPOINT,
        apiToken: env.SDK_API_TOKEN,
        privateKey: env.SDK_ENROLLA_PRIVATE_ENCRYPTION_KEY,
        polling: {
          enabled: this.pollingEnabled,
          intervalSeconds: this.pollingIntervalSeconds,
          onError: (error) => this.logger.error('onPollingError', error),
        },
      })
      .catch((err) => {
        this.logger.error('SDK Initiation Failed', err);
        throw err;
      });
  }

  async getValue<T>(tenantId: string, key: string) {
    await this.initialize();

    return sdk.getFeatureValue(key, tenantId) as T;
  }

  async getSecretValue(tenantId: string, key: string) {
    await this.initialize();

    return sdk.getSecretValue(key, tenantId);
  }
}
