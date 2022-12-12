import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateOrganizationDto } from './create-organization.dto';
import { GithubService } from './github.service';

@Controller({ path: 'management/github', version: '1' })
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class GithubController {
    constructor(private githubService: GithubService) {}

    @Post('organizations')
    async create(
        @Request() request,
        @Body() createOrganizationDto: CreateOrganizationDto
    ) {
        return await this.githubService.createOrganization(
            createOrganizationDto.id,
            request.user.org_id
        );
    }
}
