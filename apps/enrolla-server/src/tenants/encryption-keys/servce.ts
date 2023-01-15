import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EncryptionKey } from './entities';
import { CreateEncryptionKeyInput } from './dto';

@Injectable()
export class EncryptionKeyService {
  constructor(private prismaService: PrismaService) {}

  async create(
    tenantId: string,
    createEncryptionKeyInput: CreateEncryptionKeyInput
  ): Promise<EncryptionKey> {
    const { privateKey, publicKey } = createEncryptionKeyInput;

    return await this.prismaService.encryptionKey.create({
      data: {
        tenantId,
        privateKey,
        publicKey,
      },
    });
  }

  async getTennantEncryptionKey(tenantId: string): Promise<String> {
    const key = await this.prismaService.encryptionKey.findUnique({
      where: {
        tenantId,
      },
    });

    return key?.publicKey;
  }

  async update(
    tenantId: string,
    input: CreateEncryptionKeyInput
  ): Promise<EncryptionKey> {
    const { privateKey, publicKey } = input;

    return await this.prismaService.encryptionKey.update({
      where: {
        tenantId
      },
      data: {
        privateKey,
        publicKey,
      },
    });
  }

  async delete(tenantId: string) {
    return await this.prismaService.encryptionKey.delete({
      where: {
        tenantId,
      },
    });
  }
}
