import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class MongoDBConnectionOptions {
  @Field(() => String)
  host: string;

  @Field(() => Number, { nullable: true })
  port?: number;

  @Field(() => Boolean, { defaultValue: false })
  isSrv: boolean;

  @Field(() => String)
  database: string;

  @Field(() => String, { nullable: true })
  username?: string;

  @Field(() => String, { nullable: true })
  password?: string;

  @Field(() => String, { nullable: true })
  collection: string;
}
