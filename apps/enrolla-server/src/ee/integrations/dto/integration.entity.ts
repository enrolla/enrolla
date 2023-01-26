import { ObjectType, Field } from '@nestjs/graphql';
@ObjectType()
export class Integration {
  @Field(() => String)
  name: string;

  @Field(() => Boolean)
  isAvailable: boolean;

  @Field(() => Boolean)
  isConfigured: boolean;
}
