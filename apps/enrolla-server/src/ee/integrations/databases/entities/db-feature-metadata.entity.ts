import { FeatureType } from '@prisma/client';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DBFeatureMetadata {
  @Field(() => String)
  name: string;

  @Field(() => FeatureType)
  type: FeatureType;

  constructor(name: string, type: FeatureType) {
    this.name = name;
    this.type = type;
  }
}
