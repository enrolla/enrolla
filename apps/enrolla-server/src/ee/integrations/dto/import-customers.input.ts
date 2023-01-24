import { Field, InputType } from '@nestjs/graphql';
import { MongoDBConnectionOptions } from '../databases/mongodb/mongodb-connection-options';

@InputType()
export class FeatureMappingInput {
  @Field(() => String)
  sourceName: string;

  @Field(() => String)
  destinationName: string;
}

@InputType()
export class ImportCustomersInput {
  @Field(() => MongoDBConnectionOptions)
  connectionOptions: MongoDBConnectionOptions;

  @Field(() => String)
  idFieldName: string;

  @Field(() => [String])
  customerIds: string[];

  @Field(() => [FeatureMappingInput])
  features: FeatureMappingInput[];
}
