import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateSecretInput {
  @Field(() => String)
  customerId: string;

  @Field(() => String)
  key: string;

  @Field(() => String)
  value: string;

  @Field(() => Boolean)
  isSymmetric?: boolean;
}
