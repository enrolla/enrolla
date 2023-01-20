import { Field, InputType } from '@nestjs/graphql';
import { MongoDBConnectionOptions } from '../databases/mongodb/mongodb-connection-options';

@InputType()
export class ImportCustomersInput {
  @Field(() => MongoDBConnectionOptions)
  connectionOptions: MongoDBConnectionOptions;

  @Field(() => String)
  idFieldName: string;

  @Field(() => [String])
  featureFieldNames: [string];

  @Field(() => String, { nullable: true })
  schemaExampleId?: string;
}
