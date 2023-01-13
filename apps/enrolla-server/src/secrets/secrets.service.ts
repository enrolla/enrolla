import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Secret } from './entities/secret.entity';
import { env } from 'process';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

@Injectable()
export class SecretsService {
  private static ENCRYPTION_ALGORITHM = 'aes-256-ctr';
  private static RANDOM_BYTES_LENGTH = 16;
  private encryptionKey = env.SECRET_ENCRYPTION_KEY;

  constructor(private prismaService: PrismaService) {}

  async create(
    tenantId: string,
    customerId: string,
    key: string,
    value: string
  ): Promise<Secret> {
    const { encryptedData, iv } = await this.encrypt(value);

    return await this.prismaService.secret.create({
      data: {
        key: key,
        tenantId: tenantId,
        value: encryptedData,
        customerId: customerId,
        iv: iv,
      },
    });
  }

  async update(
    tenantId: string,
    customerId: string,
    id: string,
    value: string
  ): Promise<Secret> {
    const { encryptedData, iv } = await this.encrypt(value);

    return await this.prismaService.secret.update({
      where: {
        id_tenantId: {
          id,
          tenantId,
        },
      },
      data: {
        value: encryptedData,
        iv,
      },
    });
  }

  async findByCustomerId(
    tenantId: string,
    customerId: string
  ): Promise<Secret[]> {
    const secrets = await this.prismaService.secret.findMany({
      where: {
        tenantId,
        customerId,
      },
    });

    secrets.forEach(async (secret) => {
      secret.value = await this.decrypt(secret.value, secret.iv);
    });

    return secrets;
  }

  async remove(tenantId: string, id: string): Promise<void> {
    await this.prismaService.secret.delete({
      where: {
        id_tenantId: {
          id,
          tenantId,
        },
      },
    });
  }

  private async encrypt(
    value: string,
    randomBytesLength: number = SecretsService.RANDOM_BYTES_LENGTH
  ) {
    const iv = randomBytes(randomBytesLength);
    const cipher = createCipheriv(
      SecretsService.ENCRYPTION_ALGORITHM,
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
      SecretsService.ENCRYPTION_ALGORITHM,
      Buffer.from(this.encryptionKey),
      _iv
    );
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
  }
}
