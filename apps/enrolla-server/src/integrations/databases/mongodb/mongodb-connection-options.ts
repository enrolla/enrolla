import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class MongoDBConnectionOptions {
  @Field(() => String)
  host: string;

  @Field(() => Number)
  port: number;

  @Field(() => String)
  database: string;

  @Field(() => String, { nullable: true })
  username?: string;

  @Field(() => String, { nullable: true })
  password?: string;

  @Field(() => String, { nullable: true })
  collection: string;
}
