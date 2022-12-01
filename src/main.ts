import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { env } from 'process';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableVersioning();

  const config = new DocumentBuilder()
    .setTitle('Customeric API')
    .setDescription('Customer Configuration Management API')
    .setVersion('1.0')
    .addTag('customeric')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(env.SERVER_PORT);
}
bootstrap();
