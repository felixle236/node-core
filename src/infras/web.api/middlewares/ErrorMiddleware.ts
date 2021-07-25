import { ENVIRONMENT } from '@configs/Configuration';
import { Environment } from '@configs/Constants';
import { AccessDeniedError } from '@shared/exceptions/AccessDeniedError';
import { InputValidationFieldError } from '@shared/exceptions/InputValidationError';
import { InternalServerError } from '@shared/exceptions/InternalServerError';
import { IRequest } from '@shared/IRequest';
import { Response } from 'express';
import { ExpressErrorMiddlewareInterface, Middleware } from 'routing-controllers';

interface IErrorExtend extends Error {
    httpCode: number;
    code: string;
    fields?: InputValidationFieldError[];
}

@Middleware({ type: 'after' })
export class ErrorMiddleware implements ExpressErrorMiddlewareInterface {
    error(err: IErrorExtend, req: IRequest, res: Response): void {
        let errLogStack = err.stack;
        if (errLogStack && ENVIRONMENT !== Environment.LOCAL)
            errLogStack = errLogStack.replace(/\n/g, ' ').replace(/\s\s+/g, ' ');

        // Handle internal server error.
        if (!err.httpCode || err.httpCode >= 500) {
            req.log.error(errLogStack);
            err = new InternalServerError();
        }
        else if (err.httpCode === 403) {
            req.log.warn(err.message);
            err = new AccessDeniedError();
        }
        else if (!err.code) {
            // Handle internal server error.
            req.log.error(errLogStack);
            err = new InternalServerError();
        }
        else
            req.log.warn(err.message); // Logical error.

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
