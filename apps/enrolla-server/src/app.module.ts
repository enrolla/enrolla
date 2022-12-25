import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AuthzModule } from './authz/authz.module';
import { PrismaService } from './prisma.service';
import { FeaturesModule } from './features/features.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PackagesModule } from './packages/packages.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    EventEmitterModule.forRoot(),
    AuthzModule,
    FeaturesModule,
    PackagesModule,
  ],
  providers: [PrismaService],
  controllers: [AppController],
})
export class AppModule {}
