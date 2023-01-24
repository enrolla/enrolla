import { Field, InputType } from '@nestjs/graphql';
import { MongoDBConnectionOptions } from './mongodb-connection-options.input';

@InputType()
export class FetchMongoCustomersInput {
  @Field(() => MongoDBConnectionOptions)
  connectionOptions: MongoDBConnectionOptions;

  @Field(() => String)
  organizationIdField: string;

  @Field(() => String)
  customerNameField: string;
}
