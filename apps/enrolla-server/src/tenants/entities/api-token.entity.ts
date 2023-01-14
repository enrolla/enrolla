import { Field, ObjectType } from '@nestjs/graphql';
import { CuidResolver } from 'graphql-scalars';

@ObjectType()
export class ApiToken {
  constructor(props: Partial<ApiToken>) {
    Object.assign(this, props);
  }

  @Field(() => CuidResolver)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  token: string;

  @Field(() => Date)
  createdAt: Date;
}
