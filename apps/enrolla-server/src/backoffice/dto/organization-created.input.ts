import { FeatureType } from '@prisma/client';
import { IsOptional } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-scalars';
import { ApiProperty } from '@nestjs/swagger';

export class OrganizationCreatedInput {
  @ApiProperty()
  event_type: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  org_id: string;
}
