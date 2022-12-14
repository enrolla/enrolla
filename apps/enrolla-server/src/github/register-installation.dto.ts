import { ApiProperty } from '@nestjs/swagger';

export class RegisterInstallationDto {
  @ApiProperty()
  id: number;
}
