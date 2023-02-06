import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { Secret } from '../../secrets/entities/secret.entity';
import { FeatureType } from '@prisma/client';
import { GraphQLJSON } from 'graphql-scalars';

registerEnumType(FeatureType, {
  name: 'FeatureType',
});

@ObjectType()
export class SDKFeature {
  @Field(() => String)
  key: string;

  @Field(() => FeatureType)
  type: FeatureType;

  @Field(() => GraphQLJSON)
  defaultValue: object;
}

@ObjectType()
export class SDKFeatureValue {
  featureId: string;

  @Field(() => SDKFeature)
  feature: SDKFeature;

  @Field(() => GraphQLJSON)
  value: object;
}

@ObjectType()
export class CustomerForSubscription {
  @Field(() => String, { nullable: true })
  organizationId?: string;

  @Field(() => [Secret])
  secrets: Secret[];

  @Field(() => [SDKFeatureValue])
  effectiveConfiguration: SDKFeatureValue[];
}
