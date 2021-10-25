import { AccessDeniedError } from '@shared/exceptions/AccessDeniedError';
import { BaseError } from '@shared/exceptions/BaseError';
import { InputValidationError, InputValidationFieldError } from '@shared/exceptions/InputValidationError';
import { InternalServerError } from '@shared/exceptions/InternalServerError';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { IRequest } from '@shared/request/IRequest';
import { ValidationError } from 'class-validator';
import { Response } from 'express';
import { ExpressErrorMiddlewareInterface, Middleware } from 'routing-controllers';

interface IErrorExtend extends BaseError {
    httpCode: number;
    code: string;
    fields?: InputValidationFieldError[];
    errors?: ValidationError[];
}

@Middleware({ type: 'after' })
export class ErrorMiddleware implements ExpressErrorMiddlewareInterface {
    error(error: IErrorExtend, req: IRequest, res: Response): void {
        const trace = req.trace;

        if (error.httpCode === 400) {
            if (error.errors) {
                error = new InputValidationError(error.errors);
                req.logService.warn('[input-validation]', error, trace.id);
            }
            else if (!error.code) {
                req.logService.warn('[unknown]', error, trace.id);
                error = new SystemError(MessageError.UNKNOWN, error.message);
            }
            else
                req.logService.warn('[logical]', error, trace.id);
        }
        else if (error.httpCode === 401)
            req.logService.warn('[unauthorized]', error, trace.id);
        else if (error.httpCode === 403) {
            req.logService.warn('[access-denied]', error, trace.id);
            error = new AccessDeniedError();
        }
        else {
            req.logService.error('[internal-server]', error, trace.id);
            error = new InternalServerError();
        }

        error.translate(req.__);

        const errRes = {
            code: error.code,
            message: error.message
        } as IErrorExtend;

        if (error.fields)
            errRes.fields = error.fields;

        res.status(error.httpCode);
        res.render('error', errRes);
    }
}
