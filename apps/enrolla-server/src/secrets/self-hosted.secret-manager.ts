import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { env } from 'process';
import { PrismaService } from '../prisma/prisma.service';
import { SecretManager } from './secret-manager.interface';
import { Secret } from './entities/secret.entity';

export class SelfHostedSecretManager implements SecretManager {
  private static ENCRYPTION_ALGORITHM = 'aes-256-ctr';
  private static RANDOM_BYTES_LENGTH = 16;
  private encryptionKey =
    env.SECRET_ENCRYPTION_KEY || '9y$B?E(H+MbQeThWmZq4t7w!z%C*F-J@';

  constructor(private prismaService: PrismaService) {}

  async setValue(
    tenantId: string,
    customerId: string,
    key: string,
    value: string
  ): Promise<Secret> {
    const { encryptedData, iv } = await this.encrypt(value);

    return await this.prismaService.secret.upsert({
      where: {
        tenantId_customerId_key: {
          tenantId,
          customerId,
          key,
        },
      },
      update: {
        value: encryptedData,
        iv,
      },
      create: {
        key,
        tenantId,
        value: encryptedData,
        iv,
        customerId,
      },
    });
  }

  async getValue(
    tenantId: string,
    customerId: string,
    key: string
  ): Promise<string> {
    return await this.getMulti(tenantId, customerId, [key])[0].value;
  }

  async getMulti(
    tenantId: string,
    customerId: string,
    keys: string[]
  ): Promise<Secret[]> {
    const secrets = await this.prismaService.secret.findMany({
      where: {
        tenantId,
        customerId,
        key: {
          in: keys,
        },
      },
    });

    secrets.forEach(async (secret) => {
      secret.value = await this.decrypt(secret.value, secret.iv);
    });

    return secrets;
  }

  async delete(
    tenantId: string,
    customerId: string,
    key: string
  ): Promise<void> {
    await this.prismaService.secret.delete({
      where: {
        tenantId_customerId_key: {
          tenantId,
          customerId,
          key,
        },
      },
    });
  }

  private async encrypt(
    value: string,
    randomBytesLength: number = SelfHostedSecretManager.RANDOM_BYTES_LENGTH
  ) {
    const iv = randomBytes(randomBytesLength);
    const cipher = createCipheriv(
      SelfHostedSecretManager.ENCRYPTION_ALGORITHM,
      Buffer.from(this.encryptionKey),
      iv
    );

    let encrypted = cipher.update(value);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
  }

  private async decrypt(value: string, iv: string) {
    const _iv = Buffer.from(iv, 'hex');
    const encryptedText = Buffer.from(value, 'hex');
    const decipher = createDecipheriv(
      SelfHostedSecretManager.ENCRYPTION_ALGORITHM,
      Buffer.from(this.encryptionKey),
      _iv
    );
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
  }
}
