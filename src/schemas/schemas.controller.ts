import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SchemasService } from './schemas.service';

@Controller({ path: 'management/schemas', version: '1' })
@UseGuards(AuthGuard('jwt'))
export class SchemasController {
  constructor(private schemasService: SchemasService) {}
  @Get()
  async findAll() {
    return await this.schemasService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.schemasService.findOne(id);
  }
}
