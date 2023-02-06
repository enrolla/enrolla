import { ObjectType, Field } from '@nestjs/graphql';
import { FeatureValue } from '../../feature-instances/entities/feature-value.entity';
import { Secret } from '../../secrets/entities/secret.entity';

@ObjectType()
export class CustomerForSubscription {
  @Field(() => String, { nullable: true })
  organizationId?: string;

  @Field(() => [Secret])
  secrets: Secret[];

  @Field(() => [FeatureValue])
  effectiveConfiguration: FeatureValue[];
}
