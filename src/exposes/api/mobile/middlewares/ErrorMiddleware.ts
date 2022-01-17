import { ValidationError } from 'class-validator';
import { Request, Response } from 'express';
import { ExpressErrorMiddlewareInterface, Middleware } from 'routing-controllers';
import { AccessDeniedError } from 'shared/exceptions/AccessDeniedError';
import { BaseError } from 'shared/exceptions/BaseError';
import { InputValidationError, InputValidationFieldError } from 'shared/exceptions/InputValidationError';
import { InternalServerError } from 'shared/exceptions/InternalServerError';
import { LogicalError } from 'shared/exceptions/LogicalError';
import { MessageError } from 'shared/exceptions/message/MessageError';

interface IErrorExtend extends BaseError {
  httpCode: number;
  code: string;
  fields?: InputValidationFieldError[];
  errors?: ValidationError[];
}

@Middleware({ type: 'after' })
export class ErrorMiddleware implements ExpressErrorMiddlewareInterface {
  error(error: IErrorExtend, req: Request, res: Response): void {
    const trace = req.trace;

    if (error.httpCode === 400) {
      if (error.errors) {
        error = new InputValidationError(error.errors);
        req.logService.warn('[input-validation]', error, trace);
      } else if (!error.code) {
        req.logService.warn('[unknown]', error, trace);
        error = new LogicalError(MessageError.UNKNOWN, error.message);
      } else {
        req.logService.warn('[logical]', error, trace);
      }
    } else if (error.httpCode === 401) {
      req.logService.warn('[unauthorized]', error, trace);
    } else if (error.httpCode === 403) {
      req.logService.warn('[access-denied]', error, trace);
      error = new AccessDeniedError();
    } else if (error.httpCode === 404) {
      req.logService.warn('[not-found]', error, trace);
    } else {
      req.logService.error('[internal-server]', error, trace);
      error = new InternalServerError();
    }

    if (error.translate) {
      error.translate(req.__);
    }

    const errRes = {
      code: error.code,
      message: error.message,
    } as IErrorExtend;

    if (error.fields) {
      errRes.fields = error.fields;
    }

    res.status(error.httpCode);
    res.send(errRes);
  }
}
