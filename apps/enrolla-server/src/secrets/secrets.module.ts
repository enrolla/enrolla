import { Module } from '@nestjs/common';
import { SecretsService } from './secrets.service';
import { ConfigurationsModule } from '../configurations/configurations.module';

@Module({
  providers: [SecretsService],
  exports: [SecretsService],
  imports: [ConfigurationsModule],
})
export class SecretsModule {}
