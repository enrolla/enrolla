import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { SchemasModule } from './schemas/schemas.module';

@Module({
  imports: [ConfigModule.forRoot(), SchemasModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
