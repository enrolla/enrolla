import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class SecretInput {
  @Field(() => String)
  key: string;

  @Field(() => String)
  value: string;

  @Field(() => Boolean, { nullable: true })
  new?: boolean;
}
