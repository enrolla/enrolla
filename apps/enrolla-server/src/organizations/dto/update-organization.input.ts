import { CreateOrganizationInput } from './create-organization.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateOrganizationInput extends PartialType(
  CreateOrganizationInput
) {
  @Field(() => String)
  id: string;
}
