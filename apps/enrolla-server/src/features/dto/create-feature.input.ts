import { ApiProperty } from '@nestjs/swagger';
import { FeatureType } from '@prisma/client';
import { IsOptional } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-scalars';

@InputType()
export class CreateFeatureInput {
  @ApiProperty()
  @Field(() => String)
  key: string;

  @ApiProperty({
    enum: FeatureType,
  })
  @Field(() => FeatureType)
  type: FeatureType;

  @ApiProperty()
  @Field(() => GraphQLJSON, { nullable: true })
  defaultValue?: object;

  @ApiProperty()
  @IsOptional()
  @Field(() => String, { nullable: true })
  description?: string;
}
