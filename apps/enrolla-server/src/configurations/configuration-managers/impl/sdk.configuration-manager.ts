import { env } from 'process';
import { ConfigurationManager } from '../../configuration-manager.interface';
import * as sdk from '@enrolla/node-server-sdk';
import { Injectable, Logger } from '@nestjs/common';
import { EnrollaError } from '@enrolla/node-server-sdk';
import axios from 'axios';

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
    try {
      let req = {
        url: 'http://169.254.169.254/latest/api/token',
        method: 'PUT',
        headers: {
          'X-aws-ec2-metadata-token-ttl-seconds': '21600',
        },
      };
      // temp for testing
      const { data: token } = await axios(req);
      SdkConfigurationManager.logger.warn(`datadog token: ${token}`);
      const { data: hostname } = await axios.get(
        'http://169.254.169.254/latest/meta-data/local-ipv4',
        { headers: { 'X-aws-ec2-metadata-token': token } }
      );
      SdkConfigurationManager.logger.warn(`datadog host: ${hostname}`);
    } catch (err) {
      SdkConfigurationManager.logger.error('datadog host error', err.stack);
    }

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
