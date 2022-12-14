import { ApiProperty } from '@nestjs/swagger';
import { Environment } from '@prisma/client';

export class CreateCustomerDto {
  @ApiProperty()
  environment: Environment;
  @ApiProperty()
  configuration: Record<string, unknown>;
}
