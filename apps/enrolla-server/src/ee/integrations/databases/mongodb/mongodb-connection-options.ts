import { Field, InputType } from '@nestjs/graphql';
import { ConnectionOptions, Database } from '../connection-options.interface';

@InputType()
export class MongoDBConnectionOptions implements ConnectionOptions {
  type = Database.Mongo;

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
