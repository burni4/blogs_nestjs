import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import {
  ExceptionErrorsMessages,
  HttpExceptionFilter,
} from './exception.fiter';
import { useContainer } from 'class-validator';

const PORT = process.env.PORT || 3000;
async function bootstrap() {
  const rawApp = await NestFactory.create(AppModule);

  const app = connectExternalComponents(rawApp);

  await app.listen(PORT);
}

export function connectExternalComponents(app: INestApplication) {
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      stopAtFirstError: true,
      exceptionFactory:
        ExceptionErrorsMessages.exceptionFactoryForValidationPipe,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  return app;
}
bootstrap();
