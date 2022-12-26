import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PackagesService } from './packages.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { tenantIdFromRequest } from '../authz/utils';

@Controller({ path: 'management/packages', version: '1' })
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @Post()
  async create(@Request() request, @Body() createPackageDto: CreatePackageDto) {
    console.log('passed validation');
    return await this.packagesService.create(
      createPackageDto,
      tenantIdFromRequest(request)
    );
  }

  @Get()
  async findAll(@Request() request) {
    return await this.packagesService.findAll(tenantIdFromRequest(request));
  }

  @Get(':id')
  async findOne(@Request() request, @Param('id') id: string) {
    return await this.packagesService.findOne(id, tenantIdFromRequest(request));
  }

  @Patch(':id')
  async update(
    @Request() request,
    @Param('id') id: string,
    @Body() updatePackageDto: UpdatePackageDto
  ) {
    return await this.packagesService.update(
      id,
      updatePackageDto,
      tenantIdFromRequest(request)
    );
  }

  @Delete(':id')
  async remove(@Request() request, @Param('id') id: string) {
    return await this.packagesService.remove(id, tenantIdFromRequest(request));
  }
}
