import { ApiProperty } from '@nestjs/swagger';

export class CreateConfigurationDto {
  @ApiProperty()
  configuration: Record<string, unknown>;
;
}
