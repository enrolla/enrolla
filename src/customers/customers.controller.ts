import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateConfigurationDto } from './create-configuration.dto';
import { CustomersService } from './customers.service';

@Controller({ path: 'management/customers', version: '1' })
@UseGuards(AuthGuard('jwt'))
export class CustomersController {
  constructor(private customersService: CustomersService) {}

  @Post()
  async create(
    @Request() req,
    @Body() createConfigurationDto: CreateConfigurationDto,
  ) {
    return this.customersService.create(
      req.user.org_id,
      createConfigurationDto.configuration,
    );
  }
}
