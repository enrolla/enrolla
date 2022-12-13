import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CustomersService } from './customers.service';

@Controller({ path: 'customers', version: '1' })
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class CustomersApiController {
  constructor(private customersService: CustomersService) {}

  @Get()
  async findAll(@Request() request) {
    return await this.customersService.findAll(request.user.org_id);
  }

  @Get(':id')
  async findById(@Request() request, @Param('id') id: string) {
    return await this.customersService.findById(request.user.org_id, id);
  }
}
