import { ApiProperty } from '@nestjs/swagger';

export class CreateSchemaDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  schema: Record<string, unknown>;
}
