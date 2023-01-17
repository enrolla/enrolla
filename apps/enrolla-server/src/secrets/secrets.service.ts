import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Secret, SecretKey } from './entities';
import { CreateSecretKeyInput } from './dto';

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

  async hasSecrets(tenantId: string): Promise<boolean> {
    const res = await this.prismaService.secret.findFirst({
      where: {
        tenantId,
      },
    });

    return !!res;
  }

  async createKey(
    tenantId: string,
    input: CreateSecretKeyInput
  ): Promise<SecretKey> {
    const data = { ...input, tenantId };

    return await this.prismaService.secretKey.create({
      data,
    });
  }

  async removeKey(tenantId: string, id: string): Promise<SecretKey> {
    return await this.prismaService.secretKey.delete({
      where: {
        id_tenantId: {
          id,
          tenantId,
        },
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
}
