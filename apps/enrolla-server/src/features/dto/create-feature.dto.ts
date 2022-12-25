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
  @IsOptional()
  @IsString()
  description?: string;
}
