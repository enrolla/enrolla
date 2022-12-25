import { ApiProperty } from '@nestjs/swagger';
import { FeatureType } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateFeatureDto {
  @ApiProperty()
  @IsString()
  tenantId: string;

  @ApiProperty()
  @IsString()
  key: string;

  @ApiProperty({
    enum: FeatureType,
  })
  @IsEnum(FeatureType)
  type: FeatureType;

  @ApiProperty()
  // TODO: add validation the the type of defaultValue is of type attribute
  defaultValue: unknown;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string;
}
