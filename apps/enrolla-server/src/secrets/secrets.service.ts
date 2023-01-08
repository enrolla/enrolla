import { Injectable } from '@nestjs/common';
import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { env } from 'process';
import { promisify } from 'util';
import { PrismaService } from '../prisma/prisma.service';
import { Secret } from '@prisma/client';

@Injectable()
export class SecretsService {
  private static ENCRYPTION_ALGORITHM = 'aes-256-ctr';
  private static RANDOM_BYTES_LENGTH = 16;
  private encryptionKey = env.SECRET_ENCRYPTION_KEY;

  constructor(private prismaService: PrismaService) {}

  async set(tenantId: string, key: string, value: string): Promise<Secret> {
    const { encryptedValue, randomBytes } = await this.encrypt(value);

    return await this.prismaService.secret.create({
      data: {
        key,
        tenantId,
        value: encryptedValue,
        randomBytes: randomBytes,
      },
    });
  }

  async get(tenantId: string, key: string): Promise<string> {
    const secret = await this.prismaService.secret.findUnique({
      where: {
        tenantId_key: {
          tenantId,
          key,
        },
      },
    });

    return await this.decrypt(secret.value, secret.randomBytes);
  }

  async delete(tenantId: string, key: string): Promise<Secret> {
    return await this.prismaService.secret.delete({
      where: {
        tenantId_key: {
          tenantId,
          key,
        },
      },
    });
  }

  private async encrypt(
    value: string,
    randomBytesLength: number = SecretsService.RANDOM_BYTES_LENGTH
  ) {
    const iv = randomBytes(randomBytesLength);
    const key = (await promisify(scrypt)(
      this.encryptionKey,
      'salt',
      32
    )) as Buffer;
    const cipher = createCipheriv(SecretsService.ENCRYPTION_ALGORITHM, key, iv);

    return {
      encryptedValue: Buffer.concat([
        cipher.update(value),
        cipher.final(),
      ]).toString('hex'),
      randomBytes: iv.toString('hex'),
    };
  }

  private async decrypt(value: string, randomBytes: string) {
    const decipher = createDecipheriv(
      SecretsService.ENCRYPTION_ALGORITHM,
      this.encryptionKey,
      randomBytes
    );

    return Buffer.concat([
      decipher.update(Buffer.from(value)),
      decipher.final(),
    ]).toString();
  }
}
