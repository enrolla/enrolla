import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Secret } from './entities/secret.entity';
import { decrypt, encrypt } from '../utils/encryption.utils';
import { CreateSecretInput, UpdateSecretInput } from './dto';

@Injectable()
export class SecretsService {
  ENCRYPTION_IV_LENGTH = 16;

  constructor(private prismaService: PrismaService) {}

  async create(tenantId: string, input: CreateSecretInput): Promise<Secret> {
    const data = { tenantId, ...input, iv: undefined };

    if (input.isSymmetric) {
      const { encryptedData, iv } = await encrypt(
        input.value,
        this.ENCRYPTION_IV_LENGTH
      );
      data.value = encryptedData;
      data.iv = iv;
    }

    return await this.prismaService.secret.create({
      data,
    });
  }

  async update(tenantId: string, input: UpdateSecretInput): Promise<Secret> {
    const { isSymmetric, value, id } = input;
    const data = { value, isSymmetric, iv: undefined };

    if (isSymmetric) {
      const { encryptedData, iv } = await encrypt(
        value,
        this.ENCRYPTION_IV_LENGTH
      );

      data.iv = iv;
      data.value = encryptedData;
    }

    return await this.prismaService.secret.update({
      where: {
        id_tenantId: {
          id,
          tenantId,
        },
      },
      data,
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
      if (secret.isSymmetric)
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
