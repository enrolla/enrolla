import { ApiProperty } from '@nestjs/swagger';

export class CreateSchemaDto {
  @ApiProperty()
  schema: Record<string, unknown>;
}
