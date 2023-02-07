import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ValidationError } from 'class-validator';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    if (status === 400) {
      const errors: ExceptionErrorsMessages = new ExceptionErrorsMessages();
      errors.fillMessagesFromHttpExceptions(exception);
      response.status(status).json(errors);
    } else {
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }
  }
}

export class ExceptionErrorsMessages {
  errorsMessages: ErrorsMessages[];
  fillMessagesFromHttpExceptions(exception: HttpException) {
    const res: any = exception.getResponse();
    const messages = (res.message as ErrorsMessages[]) || [];
    const errorsMessages: ErrorsMessages[] = [];
    messages.forEach((mes) => {
      errorsMessages.push(mes);
    });
    this.errorsMessages = errorsMessages;
  }

  static exceptionFactoryForValidationPipe(errors: ValidationError[]) {
    const errorsMessages: ErrorsMessages[] = [];
    errors.forEach((elem) => {
      const constraintsKeys = Object.keys(elem.constraints);
      constraintsKeys.forEach((key) =>
        errorsMessages.push(
          new ErrorsMessages(elem.property, elem.constraints[key]),
        ),
      );
    });
    throw new BadRequestException(errorsMessages);
  }
}
class ErrorsMessages {
  message: string;
  field: string;
  constructor(message: string, field: string) {
    this.message = message;
    this.field = field;
  }
}