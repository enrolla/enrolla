import { CreateCustomerInput } from './create-customer.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCustomerInput extends PartialType(CreateCustomerInput) {
  @Field(() => String)
  id: string;
}
