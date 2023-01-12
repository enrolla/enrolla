import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SecretManager } from './secret-manager.interface';
import { ConfigurationsService } from '../configurations/configurations.service';
import { SelfHostedSecretManager } from './self-hosted.secret-manager';
import { Secret } from './entities/secret.entity';

@Injectable()
export class SecretsService {
  private static SECRET_MANAGER_TYPE_CONFIG_KEY = 'SECRET_MANAGER_TYPE';

  private selfHostedSecretManager: SelfHostedSecretManager;

  constructor(
    private configurationsService: ConfigurationsService,
    private prismaService: PrismaService
  ) {
    this.selfHostedSecretManager = new SelfHostedSecretManager(prismaService);
  }

  async setValue(
    tenantId: string,
    customerId: string,
    key: string,
    value: string
  ): Promise<Secret> {
    const secretManager = await this.tenantSecretManager(tenantId);

    return await secretManager.setValue(tenantId, customerId, key, value);
  }

  async getValue(tenantId: string, customerId: string, key: string) {
    const secretManager = await this.tenantSecretManager(tenantId);

    return await secretManager.getValue(tenantId, customerId, key);
  }

  async getMulti(tenantId: string, customerId: string, keys: string[]) {
    const secretManager = await this.tenantSecretManager(tenantId);

    return await secretManager.getMulti(tenantId, customerId, keys);
  }

  async delete(
    tenantId: string,
    customerId: string,
    key: string
  ): Promise<void> {
    const secretManager = await this.tenantSecretManager(tenantId);

    await secretManager.delete(tenantId, customerId, key);
  }

  private async tenantSecretManager(tenantId: string): Promise<SecretManager> {
    const secretManagerType = await this.configurationsService.getValue<string>(
      tenantId,
      SecretsService.SECRET_MANAGER_TYPE_CONFIG_KEY
    );

    switch (secretManagerType) {
      case 'SELF_HOSTED':
        return this.selfHostedSecretManager;
      default:
        throw new Error(
          `Secret manager type ${secretManagerType} not supported`
        );
    }
  }
}
