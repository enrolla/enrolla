import { Module } from '@nestjs/common';
import { SecretsService } from './secrets.service';
import { ConfigurationsModule } from '../configurations/configurations.module';
import { SecretsResolver } from './secrets.resolver';

@Module({
  providers: [SecretsService, SecretsResolver],
  exports: [SecretsService],
  imports: [ConfigurationsModule],
})
export class SecretsModule {}
