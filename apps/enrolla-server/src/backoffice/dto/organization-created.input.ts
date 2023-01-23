import { ApiProperty } from '@nestjs/swagger';

export class OrganizationCreatedInput {
  @ApiProperty()
  event_type: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  org_id: string;
}
