import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import {
  ExceptionErrorsMessages,
  HttpExceptionFilter,
} from './exception.fiter';

const PORT = process.env.PORT || 3000;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  connectExternalComponents(app);

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
}
bootstrap();
