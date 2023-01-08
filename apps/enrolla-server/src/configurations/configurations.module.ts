import { Module } from '@nestjs/common';
import { ConfigurationsService } from './configurations.service';

@Module({
  providers: [ConfigurationsService],
  exports: [ConfigurationsService],
})
export class ConfigurationsModule {}
