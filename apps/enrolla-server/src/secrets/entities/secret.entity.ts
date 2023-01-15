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

  @Field(() => Boolean)
  isSymmetric?: boolean;

  constructor(props: Partial<Secret>) {
    Object.assign(this, props);
  }
}
