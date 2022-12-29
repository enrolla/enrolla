import { Injectable } from '@nestjs/common';
import { CreateCustomerInput } from './dto/create-customer.input';
import { UpdateCustomerInput } from './dto/update-customer.input';

@Injectable()
export class CustomersService {
  async create(createCustomerInput: CreateCustomerInput, tenantId: string) {
    return 'This action adds a new customer';
  }

  async findAll(tenantId: string) {
    return `This action returns all customers`;
  }

  async findOne(id: string, tenantId: string) {
    return `This action returns a #${id} customer`;
  }

  async update(
    id: string,
    updateCustomerInput: UpdateCustomerInput,
    tenantId: string
  ) {
    return `This action updates a #${id} customer`;
  }

  async remove(id: string, tenantId: string) {
    return `This action removes a #${id} customer`;
  }
}
