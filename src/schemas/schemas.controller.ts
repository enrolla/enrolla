import { Controller, Get, Param } from '@nestjs/common';
import { SchemasService } from './schemas.service';

@Controller({ path: 'management/schemas', version: '1' })
export class SchemasController {
  constructor(private schemasService: SchemasService) {}
  @Get()
  async findAll() {
    return this.schemasService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.schemasService.findOne(id);
  }
}
