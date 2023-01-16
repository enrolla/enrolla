import { Field, ObjectType } from '@nestjs/graphql';
import { CuidResolver } from 'graphql-scalars';

@ObjectType()
export class Secret {
  @Field(() => CuidResolver)
  id: string;

  @Field(() => String)
  key: string;

  @Field(() => String)
  value: string;

  @Field(() => Date)
  createdAt: Date;

  constructor(props: Partial<Secret>) {
    Object.assign(this, props);
  }
}
