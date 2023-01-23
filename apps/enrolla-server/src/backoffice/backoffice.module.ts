import { Module } from '@nestjs/common';
import { BackofficeController } from './backoffice.controller';

@Module({
  controllers: [BackofficeController],
})
export class BackOfficeModule {}
