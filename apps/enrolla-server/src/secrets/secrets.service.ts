import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Secret, SecretKey } from './entities';
import { CreateSecretInput, UpdateSecretInput } from './dto';

@Injectable()
export class SecretsService {
  constructor(private prismaService: PrismaService) {}

  async findAllKeysForTennant(tenantId: string): Promise<SecretKey[]> {
    return await this.prismaService.secretKey.findMany({
      where: {
        tenantId,
      },
    });
  }
  
  async createKey(tenantId: string, key: string): Promise<SecretKey> {
    const data = { tenantId, key };

    return await this.prismaService.secretKey.create({
      data,
    });
  }

  async removeKey(tenantId: string, id: string): Promise<void> {
    await this.prismaService.secretKey.delete({
      where: {
        id_tenantId: {
          id,
          tenantId,
        },
      },
    });
  }

  async createSecret(tenantId: string, input: CreateSecretInput): Promise<Secret> {
    const data = { tenantId, ...input };

    return await this.prismaService.secret.create({
      data,
    });
  }

  async updateSecret(tenantId: string, input: UpdateSecretInput): Promise<Secret> {
    const { value, id } = input;

    return await this.prismaService.secret.update({
      where: {
        id_tenantId: {
          id,
          tenantId,
        },
      },
      data: {
        value
      },
    });
  }

  async findAllSecretsByCustomerId(
    tenantId: string,
    customerId: string
  ): Promise<Secret[]> {
    const secrets = await this.prismaService.secret.findMany({
      where: {
        tenantId,
        customerId,
      },
    });

    return secrets;
  }

  async removeSecret(tenantId: string, id: string): Promise<void> {
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
