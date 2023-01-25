import { ApiProperty } from '@nestjs/swagger';
import { InputType, Field } from '@nestjs/graphql';
import { CuidResolver, GraphQLJSON } from 'graphql-scalars';

@InputType()
export class FeatureInstanceByKeyInput {
  @ApiProperty()
  @Field(() => String)
  key: string;

  @ApiProperty()
  @Field(() => GraphQLJSON)
  value: object;
}

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
  @Field(() => String, { nullable: true })
  description?: string;

  @ApiProperty()
  @Field(() => String, { nullable: true })
  icon?: string;

  @ApiProperty()
  @Field(() => CuidResolver, { nullable: true })
  parentPackageId?: string;

  @ApiProperty({ type: FeatureInstanceInput, isArray: true })
  @Field(() => [FeatureInstanceInput])
  features: FeatureInstanceInput[];
}
