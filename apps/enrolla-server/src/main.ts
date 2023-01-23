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
import { SdkConfigurationManager } from './configurations/configuration-managers/impl/sdk.configuration-manager';

function createLogger(
  serviceName: string,
  releaseVersion: string,
  options?: WinstonModuleOptions
): LoggerService {
  const isProduction = env.NODE_ENV === 'production';
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
            env.ENV_NAME || 'development'
          ).toLowerCase()}-${serviceName}`,
          releaseVersion,
        }
      : {},
    format: winston.format.combine(...formats),
    transports: [consoleTransport],
    ...options,
  });
}

const onServerStart = async () => {
  await SdkConfigurationManager.initialize();
};

async function bootstrap() {
  const logger = createLogger('enrolla-server', env.VERSION_TAG);
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
    logger,
  });

  app.enableCors();
  app.enableVersioning();
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: true,
    })
  );

  const config = new DocumentBuilder()
    .setTitle('Enrolla API')
    .setDescription('Customer Configuration Management API')
    .setVersion('1.0')
    .addTag('enrolla')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger-ui', app, document);

  await app.listen(env.SERVER_PORT);
  await onServerStart();
}
bootstrap();
