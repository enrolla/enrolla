import { ApiProperty } from '@nestjs/swagger';
import { Optional } from '@nestjs/common';
import { InputType, Field } from '@nestjs/graphql';
import { CuidResolver, GraphQLJSON } from 'graphql-scalars';

@InputType()
export class FeatureInstanceInput {
  @ApiProperty()
  @Field(() => CuidResolver)
  featureId: string;

  @ApiProperty()
  @Field(() => GraphQLJSON)
  value: object;
}

@InputType()
export class CreatePackageInput {
  @ApiProperty()
  @Field(() => String)
  name: string;

  @ApiProperty()
  @Optional()
  @Field(() => String, { nullable: true })
  description?: string;

  @ApiProperty()
  @Optional()
  @Field(() => String, { nullable: true })
  icon?: string;

  @ApiProperty()
  @Optional()
  @Field(() => CuidResolver, { nullable: true })
  parentPackageId?: string;

  @ApiProperty({ type: FeatureInstanceInput, isArray: true })
  @Field(() => [FeatureInstanceInput])
  features: FeatureInstanceInput[];
}
