import { ObjectType, Field } from '@nestjs/graphql';
import { CuidResolver } from 'graphql-scalars';
import { FeatureValue } from './feature-value.entity';

@ObjectType()
export class FeatureInstance extends FeatureValue {
  @Field(() => CuidResolver)
  id: string;

  @Field(() => String)
  tenantId: string;

  @Field(() => Date)
  createdAt: Date;
}
