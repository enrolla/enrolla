import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { FeatureType } from '@prisma/client';
import { GraphQLJSON } from 'graphql-scalars';

registerEnumType(FeatureType, {
  name: 'FeatureType',
});

@ObjectType()
export class Feature {
  @Field(() => String)
  id: string;

  @Field(() => String)
  key: string;

  @Field(() => FeatureType)
  type: FeatureType;

  @Field(() => GraphQLJSON)
  defaultValue: object;

  @Field(() => String)
  description?: string;

  @Field(() => Date)
  createdAt: Date;
}
