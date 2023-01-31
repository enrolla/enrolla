import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class FetchCustomersInput {
  @Field(() => String)
  organizationIdField: string;

  @Field(() => String)
  customerNameField: string;
}
