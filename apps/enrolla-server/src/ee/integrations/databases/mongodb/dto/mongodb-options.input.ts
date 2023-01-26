import { Field, InputType } from '@nestjs/graphql';
import { DatabaseOptions } from '../../dto/connection-options.input';

@InputType()
export class MongoDBOptions extends DatabaseOptions {
  @Field(() => Boolean, { defaultValue: false })
  isSrv: boolean;

  @Field(() => String, { nullable: true })
  collection: string;
}
