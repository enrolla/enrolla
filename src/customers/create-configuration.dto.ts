import { ApiProperty } from '@nestjs/swagger';

export class CreateConfigurationDto {
  @ApiProperty()
  configuration: JSON;
}
