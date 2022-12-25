import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Request,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { FeaturesService } from './features.service';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { UpdateFeatureDto } from './dto/update-feature.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { tenantIdFromRequest } from '../authz/utils';

@Controller({ path: 'management/features', version: '1' })
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class FeaturesController {
  constructor(private readonly featuresService: FeaturesService) {}

  @Post()
  async create(@Request() request, @Body() createFeatureDto: CreateFeatureDto) {
    return await this.featuresService.create(
      createFeatureDto,
      tenantIdFromRequest(request)
    );
  }

  @Get()
  async findAll(@Request() request) {
    return await this.featuresService.findAll(tenantIdFromRequest(request));
  }

  @Get(':id')
  async findOne(@Request() request, @Param('id') id: string) {
    return await this.featuresService.findOne(id, tenantIdFromRequest(request));
  }

  @Patch(':id')
  async update(
    @Request() request,
    @Param('id') id: string,
    @Body() updateFeatureDto: UpdateFeatureDto
  ) {
    return await this.featuresService.update(
      id,
      updateFeatureDto,
      tenantIdFromRequest(request)
    );
  }

  @Delete(':id')
  async remove(@Request() request, @Param('id') id: string) {
    return await this.featuresService.remove(id, tenantIdFromRequest(request));
  }
}
