import { Field, InputType } from '@nestjs/graphql';
import { DatabaseOptions } from '../../dto/connection-options.input';

@InputType()
export class PostgresQLOptions extends DatabaseOptions {
  @Field(() => String)
  schema: string;

  @Field(() => String)
  table: string;
}
