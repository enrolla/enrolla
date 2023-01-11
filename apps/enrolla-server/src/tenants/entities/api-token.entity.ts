import { Field, ObjectType } from '@nestjs/graphql';
import { CuidResolver } from 'graphql-scalars';

@ObjectType()
export class ApiToken {
  @Field(() => CuidResolver)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  token: string;
}
