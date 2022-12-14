import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt } from 'class-validator';

export class CreateTenantDto {
  @ApiProperty()
  organizationName: string;
  @ApiProperty()
  @IsInt()
  githubInstallationId: number;
}
