import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { FeatureType } from '@prisma/client';
import { GraphQLJSON, CuidResolver } from 'graphql-scalars';

registerEnumType(FeatureType, {
  name: 'FeatureType',
});

@ObjectType()
export class Feature {
  @Field(() => CuidResolver)
  id: string;

  @Field(() => String)
  tenantId: string;

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
