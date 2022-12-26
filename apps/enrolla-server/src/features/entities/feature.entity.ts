import { ObjectType, Field } from '@nestjs/graphql';
import { FeatureType } from '@prisma/client';
import { GraphQLJSON } from 'graphql-scalars';

@ObjectType()
export class Feature {
  @Field(() => String)
  id: string;

  @Field(() => String)
  key: string;

  @Field(() => FeatureType)
  type: FeatureType;

  @Field(() => GraphQLJSON)
  defaultValue: JSON;

  @Field(() => String)
  description?: string;

  @Field(() => Date)
  createdAt: Date;
}
