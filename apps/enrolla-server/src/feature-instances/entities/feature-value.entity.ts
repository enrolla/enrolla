import { ObjectType, Field } from '@nestjs/graphql';
import { Feature } from '../../features/entities/feature.entity';
import { GraphQLJSON, CuidResolver } from 'graphql-scalars';

@ObjectType()
export class FeatureValue {
  @Field(() => CuidResolver)
  featureId: string;

  @Field(() => Feature)
  feature: Feature;

  @Field(() => GraphQLJSON)
  value: object;
}
