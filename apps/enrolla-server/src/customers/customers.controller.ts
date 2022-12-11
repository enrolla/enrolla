import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateCustomerDto } from './create-customer.dto';
import { CustomersService } from './customers.service';

@Controller({ path: 'management/customers', version: '1' })
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class CustomersController {
  constructor(private customersService: CustomersService) {}

  @Post()
  async create(
    @Request() request,
    @Body() createCustomerDto: CreateCustomerDto
  ) {
    return await this.customersService.create(
      request.user.org_id,
      createCustomerDto.configuration
    );
  }

  @Get()
  async findAll(@Request() request) {
    return await this.customersService.findAll(request.user.org_id);
  }

  @Get(':id')
  async findById(@Request() request, @Param('id') id: string) {
    return await this.customersService.findById(request.user.org_id, id);
  }

  @Delete(':id')
  async deleteById(@Request() request, @Param('id') id: string) {
    return await this.customersService.deleteById(request.user.org_id, id);
  }

  @Patch(':id')
  async patchById(
    @Request() request,
    @Param('id') id: string,
    @Body() patchCustomerDto: CreateCustomerDto
  ) {
    return await this.customersService.patch(
      request.user.org_id,
      id,
      patchCustomerDto.configuration
    );
  }
}
