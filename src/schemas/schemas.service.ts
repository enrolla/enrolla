import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class SchemasService {
  async findAll() {
    return [
      {
        id: 'cjld2cyuq0000t3rmniod1foy',
        name: 'customer',
      },
    ];
  }

  async findOne(id: string) {
    const jsonschema = readFileSync(
      join(process.cwd(), './src/schemas/schema.example.json'),
      'utf8',
    );

    return {
      id: id,
      name: 'customer',
      schema: jsonschema,
    };
  }

  async findOneByTenant(tenantId: string) {
    const jsonschema = readFileSync(
      join(process.cwd(), './src/schemas/schema.example.json'),
      'utf8',
    );

    return {
      id: 'cjld2cyuq0000t3rmniod1foy',
      name: 'customer',
      schema: jsonschema,
    };
  }
}
