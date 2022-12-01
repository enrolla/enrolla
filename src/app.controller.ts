import { Controller, Get } from '@nestjs/common';

@Controller({ version: '1' })
export class AppController {
  @Get('/ping')
  getPing(): string {
    return 'Pong!';
  }
}
