import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Secret } from './entities/secret.entity';
import { decrypt, encrypt } from '../utils/encryption.utils';

@Injectable()
export class SecretsService {
  constructor(private prismaService: PrismaService) {}

  async create(
    tenantId: string,
    customerId: string,
    key: string,
    value: string
  ): Promise<Secret> {
    const { encryptedData, iv } = await encrypt(value);

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
    const { encryptedData, iv } = await encrypt(value);

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
      secret.value = await decrypt(secret.value, secret.iv);
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
}
