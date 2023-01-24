import { CreateCustomerInput } from './create-customer.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCustomerByOrgIdInput extends PartialType(
  CreateCustomerInput
) {
  @Field(() => String)
  organizationId: string;
}
