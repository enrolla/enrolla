import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class DatabaseOptions {
  @Field(() => String)
  host: string;

  @Field(() => Number, { nullable: true })
  port?: number;

  @Field(() => String)
  database: string;

  @Field(() => String, { nullable: true })
  username?: string;

  @Field(() => String, { nullable: true })
  password?: string;
}
