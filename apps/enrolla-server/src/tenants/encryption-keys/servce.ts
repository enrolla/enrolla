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
    const { publicKey } = createEncryptionKeyInput;

    return await this.prismaService.encryptionKey.create({
      data: {
        tenantId,
        publicKey,
      },
    });
  }

  // DB constraint ensures that there is only one encryption key per tenant 
  async getTennantEncryptionKeys(tenantId: string) {
    return await this.prismaService.encryptionKey.findMany({
      where: {
        tenantId,
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
