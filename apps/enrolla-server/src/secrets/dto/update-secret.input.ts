import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateSecretInput {
    @Field(() => String)
    id: string;

  @Field(() => String)
  value: string;

  @Field(() => Boolean)
  isSymmetric?: boolean;
}
