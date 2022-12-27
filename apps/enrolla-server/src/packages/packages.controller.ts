import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PackagesService } from './packages.service';
import { CreatePackageInput } from './dto/create-package.input';
import { UpdatePackageInput } from './dto/update-package.input';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { TenantId } from '../authz/tenant.decorator';

@Controller({ path: 'management/packages', version: '1' })
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @Post()
  async create(
    @TenantId() tenantId: string,
    @Body() createPackageDto: CreatePackageInput
  ) {
    console.log('passed validation');
    return await this.packagesService.create(createPackageDto, tenantId);
  }

  @Get()
  async findAll(@TenantId() tenantId: string) {
    return await this.packagesService.findAll(tenantId);
  }

  @Get(':id')
  async findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return await this.packagesService.findOne(id, tenantId);
  }

  @Patch(':id')
  async update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() updatePackageDto: UpdatePackageInput
  ) {
    return await this.packagesService.update(id, updatePackageDto, tenantId);
  }

  @Delete(':id')
  async remove(@TenantId() tenantId: string, @Param('id') id: string) {
    return await this.packagesService.remove(id, tenantId);
  }
}
