import { ILogService } from 'application/interfaces/services/ILogService';
import { ValidationError } from 'class-validator';
import { Request, Response } from 'express';
import { ExpressErrorMiddlewareInterface, Middleware } from 'routing-controllers';
import { AccessDeniedError } from 'shared/exceptions/AccessDeniedError';
import { BaseError } from 'shared/exceptions/BaseError';
import { InputValidationError, InputValidationFieldError } from 'shared/exceptions/InputValidationError';
import { InternalServerError } from 'shared/exceptions/InternalServerError';
import { LogicalError } from 'shared/exceptions/LogicalError';
import { MessageError } from 'shared/exceptions/message/MessageError';
import { InjectService } from 'shared/types/Injection';
import Container from 'typedi';

interface IErrorExtend extends BaseError {
  httpCode: number;
  code: string;
  fields?: InputValidationFieldError[];
  errors?: ValidationError[];
}

@Middleware({ type: 'after' })
export class ErrorMiddleware implements ExpressErrorMiddlewareInterface {
  error(error: IErrorExtend, req: Request, res: Response): void {
    const logService = Container.get<ILogService>(InjectService.Log);
    const tracing = req.tracing;

    if (error.httpCode === 400) {
      if (error.errors) {
        error = new InputValidationError(error.errors);
        logService.warn('[input-validation]', error, tracing);
      } else if (!error.code) {
        logService.warn('[unknown]', error, tracing);
        error = new LogicalError(MessageError.UNKNOWN, error.message);
      } else {
        logService.warn('[logical]', error, tracing);
      }
    } else if (error.httpCode === 401) {
      logService.warn('[unauthorized]', error, tracing);
    } else if (error.httpCode === 403) {
      logService.warn('[access-denied]', error, tracing);
      error = new AccessDeniedError();
    } else if (error.httpCode === 404) {
      logService.warn('[not-found]', error, tracing);
    } else {
      logService.error('[internal-server]', error, tracing);
      error = new InternalServerError();
    }

    error.translate(req.__);

    const errRes = {
      code: error.code,
      message: error.message,
    } as IErrorExtend;

    if (error.fields) {
      errRes.fields = error.fields;
    }

    if (!res.headersSent) {
      res.status(error.httpCode);
      res.render('error', errRes);
    }
  }
}
