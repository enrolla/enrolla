import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Secret {
  @Field(() => String)
  key: string;

  @Field(() => String)
  value: string;

  constructor(key: string, value: string) {
    this.key = key;
    this.value = value;
  }
}
