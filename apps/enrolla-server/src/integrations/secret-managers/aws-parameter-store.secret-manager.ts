import { Secret } from '../../secrets/entities/secret.entity';
import { ConfigurationsService } from '../../configurations/configurations.service';
import { SecretManager } from '../../secrets/secret-manager.interface';
import { SSM } from 'aws-sdk';

export class AwsParameterStoreSecretManagaer implements SecretManager {
  private ssmClients: Map<string, SSM> = new Map();

  constructor(private configurationsService: ConfigurationsService) {}

  async getValue(
    tenantId: string,
    customerId: string,
    key: string
  ): Promise<string> {
    const ssmClient = await this.getSSMClient(tenantId);

    await ssmClient.getParameter(
      {
        Name: this.getKeyForCustomer(tenantId, customerId, key),
        WithDecryption: true,
      },
      (err, data) => {
        if (data?.Parameter) {
          return data.Parameter;
        }
      }
    );

    return null;
  }

  async getMulti(
    tenantId: string,
    customerId: string,
    keys: string[]
  ): Promise<Secret[]> {
    const ssmClient = await this.getSSMClient(tenantId);

    await ssmClient.getParameters(
      {
        Names: keys.map((key) =>
          this.getKeyForCustomer(tenantId, customerId, key)
        ),
        WithDecryption: true,
      },
      (err, data) => {
        if (data?.Parameters) {
          return data.Parameters.map(
            (parameter) =>
              new Secret(
                this.getKeyFromParameterName(parameter.Name),
                parameter.Value
              )
          );
        }
      }
    );

    return [];
  }

  async setValue(
    tenantId: string,
    customerId: string,
    key: string,
    value: string
  ): Promise<Secret> {
    const ssmClient = await this.getSSMClient(tenantId);

    await ssmClient.putParameter(
      {
        Name: this.getKeyForCustomer(tenantId, customerId, key),
        Value: value,
        Type: 'SecureString',
        Overwrite: true,
      },
      (err, data) => {
        if (data) {
          return new Secret(key, value);
        }
      }
    );

    return null;
  }

  async delete(
    tenantId: string,
    customerId: string,
    key: string
  ): Promise<void> {
    const ssmClient = await this.getSSMClient(tenantId);

    await ssmClient.deleteParameter({
      Name: this.getKeyForCustomer(tenantId, customerId, key),
    });
  }

  private getKeyForCustomer(
    tenantId: string,
    customerId: string,
    key: string
  ): string {
    return `${tenantId}\\${customerId}\\${key}`;
  }

  private getKeyFromParameterName(parameterName: string): string {
    return parameterName.split('\\')[2];
  }

  private async getSSMClient(tenantId: string): Promise<SSM> {
    if (this.ssmClients.has(tenantId)) {
      return this.ssmClients.get(tenantId);
    }

    const ssmClient = new SSM({
      apiVersion: '2014-11-06',
      region: 'us-east-1',
    });

    this.ssmClients.set(tenantId, ssmClient);

    return ssmClient;
  }
}
