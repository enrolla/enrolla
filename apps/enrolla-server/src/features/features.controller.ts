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
import { FeaturesService } from './features.service';
import { CreateFeatureInput } from './dto/create-feature.input';
import { UpdateFeatureInput } from './dto/update-feature.input';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { TenantId } from '../authz/tenant.decorator';

@Controller({ path: 'management/features', version: '1' })
@UseGuards(AuthGuard('PropelAuth'))
@ApiBearerAuth()
export class FeaturesController {
  constructor(private readonly featuresService: FeaturesService) {}

  @Post()
  async create(
    @TenantId() tenantId: string,
    @Body() createFeatureDto: CreateFeatureInput
  ) {
    return await this.featuresService.create(createFeatureDto, tenantId);
  }

  @Get()
  async findAll(@TenantId() tenantId: string) {
    return await this.featuresService.findAll(tenantId);
  }

  @Get(':id')
  async findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return await this.featuresService.findOne(id, tenantId);
  }

  @Patch(':id')
  async update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() updateFeatureDto: UpdateFeatureInput
  ) {
    return await this.featuresService.update(id, updateFeatureDto, tenantId);
  }

  @Delete(':id')
  async remove(@TenantId() tenantId: string, @Param('id') id: string) {
    return await this.featuresService.remove(id, tenantId);
  }
}
