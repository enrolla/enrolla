import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Organization {
  @Field(() => String)
  id: string;

  @Field(() => String)
  name: string;
}
