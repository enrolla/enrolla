import { Field, InputType } from '@nestjs/graphql';
import { MongoDBConnectionOptions } from './mongodb-connection-options.input';
import { FeatureMappingInput } from '../../dto/feature-mapping.input';

@InputType()
export class ImportMongoCustomersInput {
  @Field(() => MongoDBConnectionOptions)
  connectionOptions: MongoDBConnectionOptions;

  @Field(() => String)
  organizationIdField: string;

  @Field(() => String)
  customerNameField: string;

  @Field(() => [String])
  organizationIds: string[];

  @Field(() => [FeatureMappingInput])
  features: FeatureMappingInput[];
}
