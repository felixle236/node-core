import { AccessDeniedError } from '@shared/exceptions/AccessDeniedError';
import { InputValidationError, InputValidationFieldError } from '@shared/exceptions/InputValidationError';
import { InternalServerError } from '@shared/exceptions/InternalServerError';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { IRequest } from '@shared/IRequest';
import { ValidationError } from 'class-validator';
import { Response } from 'express';
import { ExpressErrorMiddlewareInterface, Middleware } from 'routing-controllers';

interface IErrorExtend extends Error {
    httpCode: number;
    code: string;
    fields?: InputValidationFieldError[];
    errors?: ValidationError[];
}

@Middleware({ type: 'after' })
export class ErrorMiddleware implements ExpressErrorMiddlewareInterface {
    error(err: IErrorExtend, req: IRequest, res: Response): void {
        const trace = req.getTraceHeader();
        let error = { ...err, stackDetail: err.stack } as any;

        if (error.httpCode === 400) {
            if (error.errors) {
                error = new InputValidationError(error.errors);
                req.logService.warn('[input-validation]', error, trace);
            }
            else if (!error.code) {
                req.logService.warn('[undefined]', error, trace);
                error = new SystemError(MessageError.OTHER, error.message);
            }
            else
                req.logService.warn('[logical]', error, trace);
        }
        else if (error.httpCode === 403) {
            req.logService.warn('[access-denied]', error, trace);
            error = new AccessDeniedError();
        }
        else if (!error.code || !error.httpCode || error.httpCode >= 500) {
            req.logService.error('[internal-server]', error, trace);
            error = new InternalServerError();
        }
        else
            req.logService.warn('[unknown]', error, trace);

        const errRes = {
            code: error.code,
            message: error.message
        } as IErrorExtend;

        if (error.fields)
            errRes.fields = error.fields;

        res.status(error.httpCode);
        res.send(errRes);
    }
}
