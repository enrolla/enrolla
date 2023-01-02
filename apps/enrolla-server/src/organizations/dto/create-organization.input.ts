import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateOrganizationInput {
  @Field(() => String)
  name: string;
}
