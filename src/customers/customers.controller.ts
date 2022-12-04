import { Body, Controller, Post } from '@nestjs/common';
import { CreateConfigurationDto } from './create-configuration.dto';
import { CustomersService } from './customers.service';

@Controller({ path: 'management/customers', version: '1' })
export class CustomersController {
  constructor(private customersService: CustomersService) {}

  @Post('/config')
  async createConfiguration(
    @Body() createConfigurationDto: CreateConfigurationDto,
  ) {
    return this.customersService.createConfigutation(
      'tenantId',
      createConfigurationDto.configuration,
    );
  }
}
