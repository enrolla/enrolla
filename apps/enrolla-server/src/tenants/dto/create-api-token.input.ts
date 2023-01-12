import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateApiTokenInput {
  @Field(() => String)
  name: string;
}
