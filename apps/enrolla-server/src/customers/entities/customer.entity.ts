import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Customer {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
