import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateTenantDto } from './create-tenant.dto';
import { TenantsService } from './tenants.service';

@Controller()
export class TenantsController {
  constructor(private readonly tenantService: TenantsService) {}

  @Post('/register')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async register(@Request() request, @Body() createTenantDto: CreateTenantDto) {
    return await this.tenantService.register(
      request.user.sub,
      createTenantDto.organizationName,
      createTenantDto.githubInstallationId
    );
  }
}
