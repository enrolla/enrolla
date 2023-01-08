import { Module } from '@nestjs/common';
import { FeaturesService } from './features.service';
import { FeaturesController } from './features.controller';
import { FeaturesResolver } from './features.resolver';
import { FeaturesLoader } from './features.loader';
import { DataLoaderInterceptor } from '../dataloader.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  controllers: [FeaturesController],
  providers: [
    FeaturesResolver,
    FeaturesService,
    FeaturesLoader,
    { provide: APP_INTERCEPTOR, useClass: DataLoaderInterceptor },
  ],
  exports: [FeaturesService, FeaturesLoader],
})
export class FeaturesModule {}
