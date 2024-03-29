import { Field, ObjectType } from '@nestjs/graphql';
import { CuidResolver } from 'graphql-scalars';

@ObjectType()
export class EncryptionKey {
  @Field(() => CuidResolver)
  id: string;

  @Field(() => String)
  publicKey: string;

  @Field(() => Date)
  createdAt: Date;

  constructor(props: Partial<EncryptionKey>) {
    Object.assign(this, props);
  }
}
