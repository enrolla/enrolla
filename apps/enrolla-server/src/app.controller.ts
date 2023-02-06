import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/')
  getPing(): string {
    return 'Pong!';
  }
}
