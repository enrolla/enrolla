import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateSecretKeyInput {
  @Field(() => String)
  key: string;
}
