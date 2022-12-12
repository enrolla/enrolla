import { Module } from '@nestjs/common';
import { GithubService } from './github.service';
import { GithubController } from './github.controller';
import { PrismaService } from '../prisma.service';
import { SchemasService } from '../schemas/schemas.service';

@Module({
  providers: [GithubService, PrismaService, SchemasService],
  controllers: [GithubController]
})
export class GithubModule {}
