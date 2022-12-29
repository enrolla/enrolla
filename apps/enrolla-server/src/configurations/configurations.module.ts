import { Module } from '@nestjs/common';
import { ConfigurationsService } from './configurations.service';

@Module({
  providers: [ConfigurationsService]
})
export class ConfigurationsModule {}
