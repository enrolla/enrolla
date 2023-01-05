import { ObjectType, Field } from '@nestjs/graphql';
import { Feature } from '../../features/entities/feature.entity';
import { GraphQLJSON } from 'graphql-scalars';

@ObjectType()
export class FeatureValue {
  featureId: string;

  @Field(() => Feature)
  feature: Feature;

  @Field(() => GraphQLJSON)
  value: object;
}
