import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Environment } from '@prisma/client';
import { env } from 'process';
import { CreateCustomerDto } from './create-customer.dto';
import { CustomersService } from './customers.service';

@Controller({ path: 'management/customers', version: '1' })
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class CustomersManagementController {
  constructor(private customersService: CustomersService) {}

  @Post()
  async create(
    @Request() request,
    @Body() createCustomerDto: CreateCustomerDto
  ) {
    const { configuration, environment } = createCustomerDto;

    return await this.customersService.create(
      request.user.org_id,
      environment,
      configuration
    );
  }

  @Get()
  @ApiQuery({ name: 'env', enum: Environment, required: false })
  async findAll(@Request() request, @Query('env') env?: Environment) {
    return await this.customersService.findAll(request.user.org_id, env);
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
