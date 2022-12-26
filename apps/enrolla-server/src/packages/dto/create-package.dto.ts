import { ApiProperty } from '@nestjs/swagger';
import { Optional } from '@nestjs/common';

export class FeatureInstanceDto {
  @ApiProperty()
  featureId: string;

  @ApiProperty()
  value: unknown;
}

export class CreatePackageDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  @Optional()
  description?: string;

  @ApiProperty()
  @Optional()
  parentPackageId?: string;

  @ApiProperty({ type: FeatureInstanceDto, isArray: true })
  features: FeatureInstanceDto[];
}
