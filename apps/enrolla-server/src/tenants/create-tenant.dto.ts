import { ApiProperty } from '@nestjs/swagger';

export class CreateTenantDto {
  @ApiProperty()
  organizationName: string;
  @ApiProperty()
  githubInstallationId: number;
}
