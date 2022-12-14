import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateSchemaDto } from './create-schema.dto';
import { SchemasService } from './schemas.service';

@Controller({ path: 'management/schemas', version: '1' })
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export default class SchemasController {
  constructor(private schemasService: SchemasService) {}

  @Post()
  async create(@Request() request, @Body() createSchemaDto: CreateSchemaDto) {
    return await this.schemasService.upsert(
      request.user.org_id,
      createSchemaDto.name,
      createSchemaDto.schema
    );
  }

  @Get()
  async findAll(@Request() request) {
    return await this.schemasService.findAll(request.user.org_id);
  }

  @Get(':id')
  async findOne(@Request() request, @Param('id') id: string) {
    return await this.schemasService.findOne(request.user.org_id, id);
  }

  @Delete(':id')
  async deleteById(@Request() request, @Param('id') id: string) {
    return await this.schemasService.deleteById(request.user.org_id, id);
  }
}
