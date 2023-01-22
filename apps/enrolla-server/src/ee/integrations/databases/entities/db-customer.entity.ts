import { Field, ObjectType } from '@nestjs/graphql';
import { DBFeature } from './db-feature.entity';

@ObjectType()
export class DBCustomer {
  @Field(() => String)
  id: string;

  @Field(() => [DBFeature])
  features: DBFeature[];

  constructor(id: string, features: DBFeature[]) {
    this.id = id;
    this.features = features;
  }
}
