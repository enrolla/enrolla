import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class GithubService {
  constructor(private prismaService: PrismaService) {}

  async findTenatByInstallationId(id: number) {
    return await this.prismaService.githubInstallation.findUnique({
      where: {
        id
      },
      select: {
        tenantId: true
      }
    });
  }

  async registerInstallation(installationId: number, tenantId: string) {
    return await this.prismaService.githubInstallation.create({
      data: {
        id: installationId,
        tenantId
      }
    });
  }
}
