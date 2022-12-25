import { Module } from '@nestjs/common';
import { FeaturesService } from './features.service';
import { FeaturesController } from './features.controller';

@Module({
  controllers: [FeaturesController],
  providers: [FeaturesService]
})
export class FeaturesModule {}
