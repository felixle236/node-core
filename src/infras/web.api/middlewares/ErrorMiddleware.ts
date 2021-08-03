import { ENVIRONMENT } from '@configs/Configuration';
import { Environment } from '@configs/Constants';
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
        let errLogStack = err.stack;
        if (errLogStack && ENVIRONMENT !== Environment.LOCAL)
            errLogStack = errLogStack.replace(/\n/g, ' ').replace(/\s\s+/g, ' ');

        if (err.httpCode === 400) {
            if (err.errors) {
                err = new InputValidationError(err.errors);
                req.log.warn(err.fields);
            }
            else if (!err.code) {
                err = new SystemError(MessageError.OTHER, err.message);
                req.log.warn(errLogStack);
            }
            else
                req.log.warn(err.message); // Logical error
        }
        else if (err.httpCode === 403) {
            req.log.warn(err.message);
            err = new AccessDeniedError();
        }
        else if (!err.code || !err.httpCode || err.httpCode >= 500) {
            req.log.error(errLogStack);
            err = new InternalServerError();
        }
        else
            req.log.warn(err.message); // Unknown error

        const errRes = {
            code: err.code,
            message: err.message
        } as IErrorExtend;

        if (err.fields)
            errRes.fields = err.fields;

        res.status(err.httpCode);
        res.send(errRes);
    }
}
