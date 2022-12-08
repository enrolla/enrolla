import { LoggerService, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  WinstonModule,
  WinstonModuleOptions,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import { env } from 'process';
import * as winston from 'winston';
import { AppModule } from './app.module';

function createLogger(
  serviceName: string,
  releaseVersion: string,
  options?: WinstonModuleOptions,
): LoggerService {
  const isProduction = process.env.NODE_ENV === 'production';
  const formats = [winston.format.timestamp(), winston.format.ms()];
  if (!isProduction) {
    formats.push(nestWinstonModuleUtilities.format.nestLike(serviceName));
  } else {
    formats.push(winston.format.json());
  }

  const consoleTransport = new winston.transports.Console({});
  if (process.env.NODE_ENV === 'test' && process.argv.includes('--silent')) {
    consoleTransport.silent = true;
  }

  return WinstonModule.createLogger({
    defaultMeta: isProduction
      ? {
          service: `${(
            process.env.ENV_NAME || 'development'
          ).toLowerCase()}-${serviceName}`,
          releaseVersion,
        }
      : {},
    format: winston.format.combine(...formats),
    transports: [consoleTransport],
    ...options,
  });
}

async function bootstrap() {
  const logger = createLogger(
    process.env.npm_package_name,
    process.env.npm_package_version,
  );
  const app = await NestFactory.create(AppModule, {
    logger,
  });

  app.enableCors();
  app.enableVersioning();
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Customeric API')
    .setDescription('Customer Configuration Management API')
    .setVersion('1.0')
    .addTag('customeric')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(env.SERVER_PORT);
}
bootstrap();
