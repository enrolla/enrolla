import { Module } from '@nestjs/common';
import { FeaturesService } from './features.service';
import { FeaturesController } from './features.controller';
import { FeaturesResolver } from './features.resolver';

@Module({
  controllers: [FeaturesController],
  providers: [FeaturesResolver, FeaturesService],
  exports: [FeaturesService],
})
export class FeaturesModule {}
