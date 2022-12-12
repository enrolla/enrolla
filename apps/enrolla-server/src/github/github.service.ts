import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class GithubService {
    constructor(private prismaService: PrismaService) {}
    
    async findByOrganizationId(id: number) {
        return await this.prismaService.githubOrganization.findUnique({
            where: {
                id
            },
        });
    }

    async createOrganization(organizationId: number, tenantId: string) {
        return await this.prismaService.githubOrganization.upsert({
            where: {
                id: organizationId,
            },
            update: {
                tenantId,
            },
            create: {
                id: organizationId,
                tenantId,
            },
        });
    }
}
