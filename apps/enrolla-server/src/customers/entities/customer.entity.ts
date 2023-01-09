import { ObjectType, Field } from '@nestjs/graphql';
import { CuidResolver } from 'graphql-scalars';
import { Package } from '../../packages/entities/package.entity';
import { FeatureValue } from '../../feature-instances/entities/feature-value.entity';
import { Secret } from '../../secrets/entities/secret.entity';

@ObjectType()
export class Customer {
  @Field(() => CuidResolver)
  id: string;

  @Field(() => String)
  tenantId: string;

  @Field(() => String, { nullable: true })
  organizationId?: string;

  @Field(() => String)
  name: string;

  @Field(() => Package, { nullable: true })
  package?: Package;

  @Field(() => String, { nullable: true })
  packageId?: string;

  @Field(() => [FeatureValue])
  features: FeatureValue[];

  secretsKeys: string[];

  @Field(() => [Secret])
  secrets: Secret[];

  @Field(() => [FeatureValue])
  effectiveConfiguration: FeatureValue[];

  @Field(() => Date)
  createdAt: Date;
}
