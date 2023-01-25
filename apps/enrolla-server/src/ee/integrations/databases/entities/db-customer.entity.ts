import { Field, ObjectType } from '@nestjs/graphql';
import { DBFeature } from './db-feature.entity';

@ObjectType()
export class DBCustomer {
  @Field(() => String)
  organizationId: string;

  @Field(() => String)
  name: string;

  @Field(() => [DBFeature], { nullable: true })
  features?: DBFeature[];

  constructor(organizationId: string, name: string, features?: DBFeature[]) {
    this.organizationId = organizationId;
    this.name = name;
    this.features = features;
  }
}
