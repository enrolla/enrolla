import { ObjectType, Field } from '@nestjs/graphql';
import { CuidResolver, SemVerResolver } from 'graphql-scalars';
import { PackageFeature } from '../../feature-instances/entities/package-feature.entity';

@ObjectType()
export class Package {
  @Field(() => CuidResolver)
  id: string;

  @Field(() => String)
  tenantId: string;

  @Field(() => Package, { nullable: true })
  parentPackage?: Package;

  @Field(() => CuidResolver, { nullable: true })
  parentPackageId?: string;

  @Field(() => String)
  name: string;

  @Field(() => SemVerResolver)
  version: string;

  @Field(() => [PackageFeature])
  features: PackageFeature[];

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  icon?: string;

  @Field(() => Date)
  createdAt: Date;
}
