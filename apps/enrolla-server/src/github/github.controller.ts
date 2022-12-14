import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RegisterInstallationDto } from './register-installation.dto';
import { GithubService } from './github.service';

@Controller({ path: 'management/github', version: '1' })
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class GithubController {
  constructor(private githubService: GithubService) {}

  @Post('installations')
  async register(
    @Request() request,
    @Body() createOrganizationDto: RegisterInstallationDto
  ) {
    return await this.githubService.registerInstallation(
      createOrganizationDto.id,
      request.user.org_id
    );
  }
}
