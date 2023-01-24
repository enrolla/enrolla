import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DBCustomer {
  @Field(() => String)
  organizationId: string;

  @Field(() => String)
  name: string;

  constructor(organizationId: string, name: string) {
    this.organizationId = organizationId;
    this.name = name;
  }
}
