import { ApiProperty } from '@nestjs/swagger';
import { FeatureInstance } from '../../features/types/feature-instance';
import { IsString } from 'class-validator';
import { Optional } from '@nestjs/common';

export class CreatePackageDto {
  @ApiProperty()
  @Optional()
  @IsString()
  name: string;

  @ApiProperty()
  @Optional()
  @IsString()
  description?: string;

  @ApiProperty()
  @Optional()
  @IsString()
  parentPackageId?: string;

  @ApiProperty()
  features: FeatureInstance[];
}
