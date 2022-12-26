import { ApiProperty } from '@nestjs/swagger';
import { FeatureType } from '@prisma/client';
import { IsOptional } from 'class-validator';

export class CreateFeatureDto {
  @ApiProperty()
  key: string;

  @ApiProperty({
    enum: FeatureType,
  })
  type: FeatureType;

  @ApiProperty()
  // TODO: add validation that the type of defaultValue is of type attribute
  defaultValue: unknown;

  @ApiProperty()
  @IsOptional()
  description?: string;
}
