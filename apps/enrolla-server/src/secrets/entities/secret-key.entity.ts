import { Field, ObjectType } from '@nestjs/graphql';
import { CuidResolver } from 'graphql-scalars';

@ObjectType()
export class SecretKey {
  @Field(() => CuidResolver)
  id: string;

  @Field(() => String)
  key: string;

  @Field(() => Date)
  createdAt: Date;

  constructor(props: Partial<SecretKey>) {
    Object.assign(this, props);
  }
}
